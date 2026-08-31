import type {
    ControlFieira,
    Tension,
} from "../../../domain/control-fieira/entity/control-fieira.js";
import type { ControlFieiraGateway } from "../../../domain/control-fieira/gateway/control-fieira.gateway.js";
import {
    FieiraCalculator,
    RequiredFieiraCalculator,
} from "../../../domain/fieira/calculators/fieira.calculator.js";
import type { ReservationFieiraGateway } from "../../../domain/reservation-fieira/gateway/reservation-fieira.gateway.js";
import type { Usecase } from "../../usecase.js";

export type ListReservationFieiraPendingInputDto = Record<string, never>;
export type ListReservationFieiraPendingOutputDto = {
    pendingStocks: {
        wireWidth: number;
        wireThickness: number;
        tension: number;
        qtdOrdens: number;
        orders: {
            order: number;
            material: number;
            orderQuantity: number;
            wireType: string;
            qtdFieiraNec: number;
        }[];
        qtdFieiraNecTotal: number;
        percentServed: number;
    }[];
};

export class ListReservationFieiraPendingUseCase implements Usecase<
    ListReservationFieiraPendingInputDto,
    ListReservationFieiraPendingOutputDto
> {
    private constructor(
        private readonly controlFieiraGateway: ControlFieiraGateway,
        private readonly reservationFieiraGateway: ReservationFieiraGateway,
    ) {}

    public static create(
        controlFieiraGateway: ControlFieiraGateway,
        reservationFieiraGateway: ReservationFieiraGateway,
    ) {
        return new ListReservationFieiraPendingUseCase(
            controlFieiraGateway,
            reservationFieiraGateway,
        );
    }

    public async execute(): Promise<ListReservationFieiraPendingOutputDto> {
        const pendingStock = await this.controlFieiraGateway.listFieirasPendingStock();

        const groups = new Map<
            string,
            {
                controlFieiras: ControlFieira[];
                wireWitdh: number;
                wireThickness: number;
                tension: Tension;
                nominalCapacity: number;
            }
        >();

        for (const controlFieira of pendingStock) {
            const fieira = FieiraCalculator.calculate({
                metal: controlFieira.metal,
                tension: controlFieira.tension,
                width: controlFieira.width,
                thickness: controlFieira.thickness,
            });

            const key = `${controlFieira.width}x${controlFieira.thickness} - T ${controlFieira.tension}`;

            const group = groups.get(key);

            if (group) {
                group.controlFieiras.push(controlFieira);
            } else {
                groups.set(key, {
                    controlFieiras: [controlFieira],
                    wireWitdh: controlFieira.width,
                    wireThickness: controlFieira.thickness,
                    tension: controlFieira.tension,
                    nominalCapacity: fieira.nominalCapacity,
                });
            }
        }
        const pendingStocks = [];

        for (const group of groups.values()) {
            const totalOrderQuantity = group.controlFieiras.reduce(
                (total, controlFieira) => total + controlFieira.orderQuantity,
                0,
            );

            const qtdFieiraNecTotal = RequiredFieiraCalculator.calculate({
                orderQuantity: totalOrderQuantity,
                nominalCapacity: group.nominalCapacity,
            });

            let totalReserved = 0;

            for (const controlFieira of group.controlFieiras) {
                const reservations =
                    await this.reservationFieiraGateway.findByControlFieira(
                        controlFieira.order!,
                    );

                totalReserved += reservations.reduce(
                    (total, reservation) => total + reservation.quantity!,
                    0,
                );
            }

            const percentServed = Math.min(
                (totalReserved / totalOrderQuantity) * 100,
                100,
            );

            pendingStocks.push({
                wireWidth: group.wireWitdh,
                wireThickness: group.wireThickness,
                tension: group.tension,
                qtdOrdens: group.controlFieiras.length,
                orders: group.controlFieiras.map((controlFieira) => ({
                    order: controlFieira.order,
                    material: controlFieira.material,
                    orderQuantity: controlFieira.orderQuantity,
                    wireType: controlFieira.wireType,
                    qtdFieiraNec: controlFieira.qtdFieiraNec,
                })),
                qtdFieiraNecTotal: qtdFieiraNecTotal,
                percentServed: percentServed,
            });
        }
        return {
            pendingStocks,
        };
    }
}
