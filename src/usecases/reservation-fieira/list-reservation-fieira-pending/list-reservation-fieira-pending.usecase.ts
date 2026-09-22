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
            percentServed: number;
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
        const pendingControlFieiras =
            await this.controlFieiraGateway.listFieirasPendingStock();

        type PendingControlFieira = {
            controlFieira: ControlFieira;
            totalReserved: number;
            percentServed: number;
        };

        const pendingStock: PendingControlFieira[] = [];

        for (const controlFieira of pendingControlFieiras) {
            const reservations = await this.reservationFieiraGateway.findByControlFieira(
                controlFieira.id!,
            );

            const totalReserved = reservations.reduce(
                (total, reservation) => total + (reservation.quantity ?? 0),
                0,
            );

            const percentServed = Math.min(
                (totalReserved / controlFieira.orderQuantity) * 100,
                100,
            );

            if (percentServed >= 100) {
                continue;
            }

            pendingStock.push({
                controlFieira,
                totalReserved,
                percentServed,
            });
        }

        const groups = new Map<
            string,
            {
                controlFieiras: PendingControlFieira[];
                wireWidth: number;
                wireThickness: number;
                tension: Tension;
                nominalCapacity: number;
            }
        >();

        for (const pending of pendingStock) {
            const controlFieira = pending.controlFieira;

            const fieira = FieiraCalculator.calculate({
                metal: controlFieira.metal,
                tension: controlFieira.tension,
                width: controlFieira.width,
                thickness: controlFieira.thickness,
            });

            const key = `${controlFieira.width}x${controlFieira.thickness} - T ${controlFieira.tension}`;

            const group = groups.get(key);

            if (group) {
                group.controlFieiras.push(pending);
            } else {
                groups.set(key, {
                    controlFieiras: [pending],
                    wireWidth: controlFieira.width,
                    wireThickness: controlFieira.thickness,
                    tension: controlFieira.tension,
                    nominalCapacity: fieira.nominalCapacity,
                });
            }
        }
        const pendingStocks: ListReservationFieiraPendingOutputDto["pendingStocks"] = [];

        for (const group of groups.values()) {
            const totalOrderQuantity = group.controlFieiras.reduce(
                (total, pending) => total + pending.controlFieira.orderQuantity,
                0,
            );

            const qtdFieiraNecTotal = RequiredFieiraCalculator.calculate({
                orderQuantity: totalOrderQuantity,
                nominalCapacity: group.nominalCapacity,
            });

            const totalReserved = group.controlFieiras.reduce(
                (total, pending) => total + pending.totalReserved,
                0,
            );

            const percentServed = Math.min(
                (totalReserved / totalOrderQuantity) * 100,
                100,
            );

            const orders = group.controlFieiras.map((pending) => {
                const controlFieira = pending.controlFieira;

                return {
                    order: controlFieira.order,
                    material: controlFieira.material,
                    orderQuantity: controlFieira.orderQuantity,
                    wireType: controlFieira.wireType,
                    qtdFieiraNec: controlFieira.qtdFieiraNec,
                    qtdFieiraReserved: pending.totalReserved,
                    percentServed: pending.percentServed,
                };
            });

            pendingStocks.push({
                wireWidth: group.wireWidth,
                wireThickness: group.wireThickness,
                tension: group.tension,
                qtdOrdens: group.controlFieiras.length,
                orders,
                qtdFieiraNecTotal,
                percentServed,
            });
        }
        return {
            pendingStocks,
        };
    }
}
