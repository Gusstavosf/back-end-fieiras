import { jest } from "@jest/globals";
import { StatusFieira, Stock } from "../../../domain/stock/entity/stock.js";
import type { StockGateway } from "../../../domain/stock/gateway/stock.gateway.js";
import type { StockHistoryGateway } from "../../../domain/stock/gateway/stock-history.gateway.js";
import { CorrectStockHistoryUseCase } from "./correct-stock-history.usecase.js";
import { StockHistory } from "../../../domain/stock/entity/stock-history.js";
import NotFound from "../../../core/shared/errors/notFound.js";

describe("CorrectStockHistoryUseCase.execute()", () => {
    it("should correct stock history successfully", async () => {
        const stockHistorykGateway: jest.Mocked<StockHistoryGateway> = {
            findById: jest.fn(),
            update: jest.fn(),
            listByStockId: jest.fn(),
            delete: jest.fn(),
            updateMany: jest.fn(),
        };

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

        const restoreStock = Stock.restore({
            id: 1,
            fieiraId: 1,
            code: "A01",
            status: StatusFieira.Polished,
            currentThickness: 4,
            currentWidth: 2,
            utilization: 1,
            production: 100,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const restoreRequested = StockHistory.restore({
            id: 1,
            stockFieiraId: 1,
            status: StatusFieira.Requested,
            thickness: null,
            width: null,
            production: 0,
            utilization: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const restoreNew = StockHistory.restore({
            id: 2,
            stockFieiraId: 1,
            status: StatusFieira.New,
            thickness: null,
            width: null,
            production: 0,
            utilization: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const restorePolished = StockHistory.restore({
            id: 3,
            stockFieiraId: 1,
            status: StatusFieira.Polished,
            thickness: 4,
            width: 2,
            production: 100,
            utilization: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const allTimeline = [restoreRequested, restoreNew, restorePolished];

        stockHistorykGateway.findById.mockResolvedValueOnce(restorePolished);

        stockHistorykGateway.listByStockId.mockResolvedValueOnce(allTimeline);

        stockGateway.findById.mockResolvedValueOnce(restoreStock);

        const useCase = CorrectStockHistoryUseCase.create(
            stockHistorykGateway,
            stockGateway,
        );

        const output = await useCase.execute({
            id: 1,
            status: StatusFieira.Polished,
            thickness: 4,
            width: 3,
            production: 100,
        });

        expect(output).toEqual({
            id: 3,
            status: StatusFieira.Polished,
            thickness: 4,
            width: 3,
            production: 100,
            utilization: 1,
            createdAt: restorePolished.createdAt,
            updatedAt: restorePolished.updatedAt,
        });

        expect(stockHistorykGateway.findById).toHaveBeenCalledWith(1);
        expect(stockHistorykGateway.listByStockId).toHaveBeenCalledWith(1);
        expect(stockHistorykGateway.update).toHaveBeenCalledTimes(1);
        expect(stockGateway.findById).toHaveBeenCalledWith(1);
        expect(stockGateway.update).toHaveBeenCalledTimes(1);
    });

    it("should throw NotFound when history cannot be found", async () => {
        const stockHistorykGateway: jest.Mocked<StockHistoryGateway> = {
            findById: jest.fn(),
            update: jest.fn(),
            listByStockId: jest.fn(),
            delete: jest.fn(),
            updateMany: jest.fn(),
        };

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

        stockHistorykGateway.findById.mockResolvedValueOnce(null);

        const useCase = CorrectStockHistoryUseCase.create(
            stockHistorykGateway,
            stockGateway,
        );
        await expect(
            useCase.execute({
                id: 1,
                status: StatusFieira.Polished,
                thickness: 4,
                width: 3,
                production: 100,
            }),
        ).rejects.toThrow(NotFound);

        expect(stockHistorykGateway.findById).toHaveBeenCalledWith(1);
        expect(stockHistorykGateway.listByStockId).not.toHaveBeenCalled();
        expect(stockGateway.findById).not.toHaveBeenCalled();
        expect(stockHistorykGateway.update).not.toHaveBeenCalled();
        expect(stockGateway.update).not.toHaveBeenCalled();
    });

    it("should throw NotFound when timeline cannot be found", async () => {
        const stockHistorykGateway: jest.Mocked<StockHistoryGateway> = {
            findById: jest.fn(),
            update: jest.fn(),
            listByStockId: jest.fn(),
            delete: jest.fn(),
            updateMany: jest.fn(),
        };

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

        const restorePolished = StockHistory.restore({
            id: 3,
            stockFieiraId: 1,
            status: StatusFieira.Polished,
            thickness: 4,
            width: 2,
            production: 100,
            utilization: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        stockHistorykGateway.findById.mockResolvedValueOnce(restorePolished);

        stockHistorykGateway.listByStockId.mockResolvedValueOnce(null);

        const useCase = CorrectStockHistoryUseCase.create(
            stockHistorykGateway,
            stockGateway,
        );

        await expect(
            useCase.execute({
                id: 1,
                status: StatusFieira.Polished,
                thickness: 4,
                width: 3,
                production: 100,
            }),
        ).rejects.toThrow(NotFound);

        expect(stockHistorykGateway.findById).toHaveBeenCalledWith(1);
        expect(stockHistorykGateway.listByStockId).toHaveBeenCalledWith(1);
        expect(stockGateway.findById).not.toHaveBeenCalled();
        expect(stockHistorykGateway.update).not.toHaveBeenCalled();
        expect(stockGateway.update).not.toHaveBeenCalled();
    });

    it("should throw NotFound when stock cannot be found", async () => {
        const stockHistorykGateway: jest.Mocked<StockHistoryGateway> = {
            findById: jest.fn(),
            update: jest.fn(),
            listByStockId: jest.fn(),
            delete: jest.fn(),
            updateMany: jest.fn(),
        };

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

        const restoreRequested = StockHistory.restore({
            id: 1,
            stockFieiraId: 1,
            status: StatusFieira.Requested,
            thickness: null,
            width: null,
            production: 0,
            utilization: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const restoreNew = StockHistory.restore({
            id: 2,
            stockFieiraId: 1,
            status: StatusFieira.New,
            thickness: null,
            width: null,
            production: 0,
            utilization: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const restorePolished = StockHistory.restore({
            id: 3,
            stockFieiraId: 1,
            status: StatusFieira.Polished,
            thickness: 4,
            width: 2,
            production: 100,
            utilization: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const allTimeline = [restoreRequested, restoreNew, restorePolished];

        stockHistorykGateway.findById.mockResolvedValueOnce(restorePolished);

        stockHistorykGateway.listByStockId.mockResolvedValueOnce(allTimeline);

        stockGateway.findById.mockResolvedValueOnce(null);

        const useCase = CorrectStockHistoryUseCase.create(
            stockHistorykGateway,
            stockGateway,
        );

        await expect(
            useCase.execute({
                id: 1,
                status: StatusFieira.Polished,
                thickness: 4,
                width: 3,
                production: 100,
            }),
        ).rejects.toThrow(NotFound);

        expect(stockHistorykGateway.findById).toHaveBeenCalledWith(1);
        expect(stockHistorykGateway.listByStockId).toHaveBeenCalledWith(1);
        expect(stockGateway.findById).toHaveBeenCalledWith(1);
        expect(stockHistorykGateway.update).toHaveBeenCalledTimes(1);

        expect(stockGateway.update).not.toHaveBeenCalled();
    });
});
