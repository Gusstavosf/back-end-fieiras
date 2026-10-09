import { jest } from "@jest/globals";
import {
    ControlFieira,
    ControlStatus,
    Metal,
} from "../../../domain/control-fieira/entity/control-fieira.js";
import type { ControlFieiraGateway } from "../../../domain/control-fieira/gateway/control-fieira.gateway.js";
import { Fieira } from "../../../domain/fieira/entity/fieira.js";
import type { FieiraGateway } from "../../../domain/fieira/gateway/fieira.gateway.js";
import type { ReservationFieiraGateway } from "../../../domain/reservation-fieira/gateway/reservation-fieira.gateway.js";
import { StatusFieira, Stock } from "../../../domain/stock/entity/stock.js";
import type { StockGateway } from "../../../domain/stock/gateway/stock.gateway.js";
import { CreateReservationFieiraUseCase } from "./create-reservation-fieira.usecase.js";

describe("CreateReservationFieiraUseCase.execute()", () => {
    it("should cap reservation by stock capacity", async () => {
        const controlFieira = ControlFieira.create({
            fieiraId: 1,
            order: 10,
            material: 1,
            orderQuantity: 2000,
            wireType: "AWG 12",
            metal: Metal.Cu,
            tension: 120,
            width: 50,
            thickness: 2.5,
            orderStartDate: new Date("2026-01-01"),
            orderEndDate: new Date("2026-01-10"),
            orderCreateDate: new Date("2025-12-15"),
            qtdFieiraNec: 3,
            status: ControlStatus.Open,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const fieira = Fieira.restore({
            id: 1,
            cabinetId: null,
            width: 50,
            thickness: 2.5,
            tension: 120,
            nominalFieiraCapacity: 816,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const stockFieira = Stock.restore({
            id: 7,
            fieiraId: 1,
            code: "A01",
            status: StatusFieira.New,
            currentThickness: null,
            currentWidth: null,
            utilization: 0,
            production: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const controlFieiraGateway: jest.Mocked<ControlFieiraGateway> = {
            save: jest.fn(),
            list: jest.fn(),
            findById: jest.fn(),
            findByOrder: jest.fn(),
            findByOrders: jest.fn(),
            listPendingFieiras: jest.fn(),
            listFieirasPendingStock: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        };

        const fieiraGateway: jest.Mocked<FieiraGateway> = {
            save: jest.fn(),
            list: jest.fn(),
            findByName: jest.fn(),
            findById: jest.fn(),
            findByCabinetId: jest.fn(),
            findByDimensions: jest.fn(),
            update: jest.fn(),
            deleteByCabinetName: jest.fn(),
        };

        const stockGateway: jest.Mocked<StockGateway> = {
            save: jest.fn(),
            list: jest.fn(),
            findById: jest.fn(),
            findByCode: jest.fn(),
            findIdCabinetByName: jest.fn(),
            findEmptyCabinet: jest.fn(),
            findReusableCabinets: jest.fn(),
            findProductionByStatus: jest.fn(),
            update: jest.fn(),
            saveHistory: jest.fn(),
            delete: jest.fn(),
        };

        const reservationGateway: jest.Mocked<ReservationFieiraGateway> = {
            save: jest.fn(),
            update: jest.fn(),
            findByControlFieira: jest.fn(),
            findByStockFieira: jest.fn(),
        };

        controlFieiraGateway.findById.mockResolvedValue(controlFieira);
        fieiraGateway.findById.mockResolvedValue(fieira);
        stockGateway.findById.mockResolvedValue(stockFieira);
        reservationGateway.findByControlFieira.mockResolvedValue([]);
        reservationGateway.findByStockFieira.mockResolvedValue([]);

        reservationGateway.save.mockImplementation(async (reservation) => reservation);

        const useCase = CreateReservationFieiraUseCase.create(
            controlFieiraGateway,
            stockGateway,
            reservationGateway,
            fieiraGateway,
        );

        const output = await useCase.execute({
            controlId: controlFieira.id!,
            stockFieiraId: stockFieira.id!,
        });

        expect(output.quantity).toBe(816);

        expect(reservationGateway.save).toHaveBeenCalledWith(
            expect.objectContaining({
                controlId: controlFieira.id!,
                stockFieiraId: stockFieira.id!,
                quantity: 816,
            }),
        );
    });
});
