import { jest } from "@jest/globals";
import NotFound from "../../../core/shared/errors/notFound.js";
import { Stock, StatusFieira } from "../../../domain/stock/entity/stock.js";
import type { StockGateway } from "../../../domain/stock/gateway/stock.gateway.js";
import { UpdateStockUseCase } from "./update-stock.usecase.js";

describe("UpdateStockUseCase.execute()", () => {
    it("should update stock successfully when status does not requires details", async () => {
        const stockGateway: jest.Mocked<StockGateway> = {
            list: jest.fn(),
            findById: jest.fn(),
            findByCode: jest.fn(),
            findIdCabinetByName: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            saveHistory: jest.fn(),
            delete: jest.fn(),
        };

        const restoreRequested = {
            id: 1,
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

        const useCase = UpdateStockUseCase.create(stockGateway);

        stockGateway.findIdCabinetByName.mockResolvedValue(1);

        stockGateway.findByCode.mockResolvedValueOnce(Stock.restore(restoreRequested));

        const output = await useCase.execute({
            cabinetName: "CTC001",
            code: "A01",
            status: StatusFieira.New,
        });

        expect(stockGateway.update).toHaveBeenCalledTimes(1);

        expect(output.code).toBe("A01");
        expect(output.status).toBe(StatusFieira.New);
        expect(output.fieiraId).toBe(1);

        expect(stockGateway.findIdCabinetByName).toHaveBeenCalledWith("CTC001");
        expect(stockGateway.findByCode).toHaveBeenCalledWith("A01", 1);
        expect(stockGateway.saveHistory).toHaveBeenCalledTimes(1);
        expect(stockGateway.saveHistory).toHaveBeenCalledWith({
            stockFieiraId: 1,
            status: StatusFieira.New,
            thickness: null,
            width: null,
            production: 0,
            utilization: 0,
        });
    });

    it("should update stock successfully when status requireS details", async () => {
        const stockGateway: jest.Mocked<StockGateway> = {
            list: jest.fn(),
            findById: jest.fn(),
            findByCode: jest.fn(),
            findIdCabinetByName: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            saveHistory: jest.fn(),
            delete: jest.fn(),
        };

        const restoreNew = {
            id: 1,
            fieiraId: 1,
            code: "A01",
            status: StatusFieira.New,
            currentThickness: null,
            currentWidth: null,
            utilization: 0,
            production: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const useCase = UpdateStockUseCase.create(stockGateway);

        stockGateway.findIdCabinetByName.mockResolvedValue(1);

        stockGateway.findByCode.mockResolvedValueOnce(Stock.restore(restoreNew));

        const output = await useCase.execute({
            cabinetName: "CTC001",
            code: "A01",
            status: StatusFieira.Polished,
            thickness: 4,
            width: 2,
            production: 100,
            utilization: 1,
        });

        expect(stockGateway.update).toHaveBeenCalledTimes(1);

        expect(output).toEqual({
            id: 1,
            fieiraId: 1,
            code: "A01",
            status: StatusFieira.Polished,
            currentThickness: 4,
            currentWidth: 2,
            production: 100,
            utilization: 1,
            createdAt: restoreNew.createdAt,
            updatedAt: restoreNew.updatedAt,
        });

        expect(stockGateway.findIdCabinetByName).toHaveBeenCalledWith("CTC001");
        expect(stockGateway.findByCode).toHaveBeenCalledWith("A01", 1);
        expect(stockGateway.saveHistory).toHaveBeenCalledTimes(1);
        expect(stockGateway.saveHistory).toHaveBeenCalledWith({
            stockFieiraId: 1,
            status: StatusFieira.Polished,
            thickness: 4,
            width: 2,
            production: 100,
            utilization: 1,
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
            delete: jest.fn(),
        };

        const useCase = UpdateStockUseCase.create(stockGateway);

        stockGateway.findIdCabinetByName.mockResolvedValue(null);

        await expect(
            useCase.execute({
                cabinetName: "CTC001",
                code: "A01",
                status: StatusFieira.New,
            }),
        ).rejects.toThrow(NotFound);

        expect(stockGateway.findByCode).not.toHaveBeenCalled();
        expect(stockGateway.update).not.toHaveBeenCalled();
        expect(stockGateway.saveHistory).not.toHaveBeenCalled();
    });

    it("should throw NotFound when fieira does not exist", async () => {
        const stockGateway: jest.Mocked<StockGateway> = {
            list: jest.fn(),
            findById: jest.fn(),
            findByCode: jest.fn(),
            findIdCabinetByName: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            saveHistory: jest.fn(),
            delete: jest.fn(),
        };

        const useCase = UpdateStockUseCase.create(stockGateway);

        stockGateway.findIdCabinetByName.mockResolvedValue(1);

        stockGateway.findByCode.mockResolvedValue(null);

        await expect(
            useCase.execute({
                cabinetName: "CTC001",
                code: "A01",
                status: StatusFieira.New,
            }),
        ).rejects.toThrow(NotFound);

        expect(stockGateway.findIdCabinetByName).toHaveBeenCalledWith("CTC001");
        expect(stockGateway.findByCode).toHaveBeenCalledWith("A01", 1);

        expect(stockGateway.update).not.toHaveBeenCalled();
        expect(stockGateway.saveHistory).not.toHaveBeenCalled();
    });
});
