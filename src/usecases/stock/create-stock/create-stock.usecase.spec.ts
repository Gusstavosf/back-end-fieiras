import { jest } from "@jest/globals";
import NotFound from "../../../core/shared/errors/notFound.js";
import { Stock, StatusFieira } from "../../../domain/stock/entity/stock.js";
import type { StockGateway } from "../../../domain/stock/gateway/stock.gateway.js";
import { CreateStockUseCase } from "./create-stock.usecase.js";
import IncorrectRequest from "../../../core/shared/errors/incorrectRequest.js";

describe("CreateStockUseCase.execute()", () => {
    it("should create a stock successfully", async () => {
        const stockGateway: jest.Mocked<StockGateway> = {
            list: jest.fn(),
            findById: jest.fn(),
            findByCode: jest.fn(),
            findIdCabinetByName: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            saveHistory: jest.fn(),
            detele: jest.fn(),
        };

        const restoreRequested = {
            id: 10,
            fieiraId: 1,
            code: "A01",
            status: StatusFieira.Requested,
            currentThickness: null,
            currentWidth: null,
            utilization: 0,
            production: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const useCase = CreateStockUseCase.create(stockGateway);

        stockGateway.findIdCabinetByName.mockResolvedValue(1);

        stockGateway.findByCode.mockResolvedValueOnce(null);

        stockGateway.findByCode.mockResolvedValueOnce(Stock.restore(restoreRequested));

        const output = await useCase.execute({
            cabinetName: "CTC001",
            code: "A01",
        });

        expect(stockGateway.save).toHaveBeenCalledTimes(1);
        expect(output.code).toBe("A01");
        expect(output.status).toBe(StatusFieira.Requested);
        expect(output.fieiraId).toBe(1);

        expect(stockGateway.saveHistory).toHaveBeenCalledTimes(1);
        expect(stockGateway.saveHistory).toHaveBeenCalledWith({
            stockFieiraId: 10,
            status: StatusFieira.Requested,
            thickness: null,
            width: null,
            production: 0,
            utilization: 0,
        });
    });

    it("should throw NotFound when cabinet does not exist", async () => {
        const stockGateway: jest.Mocked<StockGateway> = {
            list: jest.fn(),
            findById: jest.fn(),
            findByCode: jest.fn(),
            findIdCabinetByName: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            saveHistory: jest.fn(),
            detele: jest.fn(),
        };

        const useCase = CreateStockUseCase.create(stockGateway);

        stockGateway.findIdCabinetByName.mockResolvedValue(null);

        await expect(
            useCase.execute({
                cabinetName: "CTC001",
                code: "A01",
            }),
        ).rejects.toThrow(NotFound);

        expect(stockGateway.findByCode).not.toHaveBeenCalled();
        expect(stockGateway.save).not.toHaveBeenCalled();
        expect(stockGateway.saveHistory).not.toHaveBeenCalled();
    });

    it("should throw IncorrectRequest when stock already exists", async () => {
        const stockGateway: jest.Mocked<StockGateway> = {
            list: jest.fn(),
            findById: jest.fn(),
            findByCode: jest.fn(),
            findIdCabinetByName: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            saveHistory: jest.fn(),
            detele: jest.fn(),
        };

        const restoreRequested = {
            id: 10,
            fieiraId: 1,
            code: "A01",
            status: StatusFieira.Requested,
            currentThickness: null,
            currentWidth: null,
            utilization: 0,
            production: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const useCase = CreateStockUseCase.create(stockGateway);

        stockGateway.findIdCabinetByName.mockResolvedValue(1);

        stockGateway.findByCode.mockResolvedValue(Stock.restore(restoreRequested));

        await expect(
            useCase.execute({
                cabinetName: "CTC001",
                code: "A01",
            }),
        ).rejects.toThrow(IncorrectRequest);

        expect(stockGateway.save).not.toHaveBeenCalled();
        expect(stockGateway.saveHistory).not.toHaveBeenCalled();
    });

    it("should throw NotFound when created stock cannot be retrieved", async () => {
        const stockGateway: jest.Mocked<StockGateway> = {
            list: jest.fn(),
            findById: jest.fn(),
            findByCode: jest.fn(),
            findIdCabinetByName: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            saveHistory: jest.fn(),
            detele: jest.fn(),
        };

        const useCase = CreateStockUseCase.create(stockGateway);

        stockGateway.findIdCabinetByName.mockResolvedValue(1);

        stockGateway.findByCode.mockResolvedValueOnce(null);

        stockGateway.findByCode.mockResolvedValueOnce(null);

        await expect(
            useCase.execute({
                cabinetName: "CTC001",
                code: "A01",
            }),
        ).rejects.toThrow(NotFound);

        expect(stockGateway.save).toHaveBeenCalledTimes(1);
        expect(stockGateway.saveHistory).not.toHaveBeenCalled();
    });
});
