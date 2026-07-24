import { jest } from "@jest/globals";
import { StatusFieira, Stock } from "../../../domain/stock/entity/stock.js";
import type { StockGateway } from "../../../domain/stock/gateway/stock.gateway.js";
import type { StockHistoryGateway } from "../../../domain/stock/gateway/stock-history.gateway.js";
import { DeleteStockHistoryUseCase } from "./delete-stock-history.usecase.js";
import { StockHistory } from "../../../domain/stock/entity/stock-history.js";
import NotFound from "../../../core/shared/errors/notFound.js";

describe("DeleteStockHistoryUseCase.execute()", () => {
    it("should delete stock history successfully", async () => {
        const stockHistoryGateway: jest.Mocked<StockHistoryGateway> = {
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

        stockHistoryGateway.findById.mockResolvedValueOnce(restorePolished);

        stockHistoryGateway.listByStockId.mockResolvedValueOnce(allTimeline);

        stockGateway.findById.mockResolvedValueOnce(restoreStock);

        const useCase = DeleteStockHistoryUseCase.create(
            stockHistoryGateway,
            stockGateway,
        );

        const output = await useCase.execute({
            id: 3,
        });

        expect(output).toEqual({
            stockFieiraId: 1,
            status: StatusFieira.Polished,
            thickness: 4,
            width: 2,
            production: 100,
            utilization: 1,
            createdAt: restorePolished.createdAt,
            updatedAt: restorePolished.updatedAt,
        });

        expect(stockHistoryGateway.findById).toHaveBeenCalledWith(3);
        expect(stockHistoryGateway.listByStockId).toHaveBeenCalledWith(1);

        expect(stockHistoryGateway.delete).toHaveBeenCalledTimes(1);
        expect(stockHistoryGateway.delete).toHaveBeenCalledWith(3);

        expect(stockHistoryGateway.updateMany).toHaveBeenCalledTimes(1);
        expect(stockHistoryGateway.updateMany).toHaveBeenCalledWith([
            restoreRequested,
            restoreNew,
        ]);

        expect(stockGateway.findById).toHaveBeenCalledWith(1);
        expect(stockGateway.update).toHaveBeenCalledTimes(1);
        expect(stockGateway.update).toHaveBeenCalledWith(restoreStock);
    });

    it("should throw NotFound when history cannot be found", async () => {
        const stockHistoryGateway: jest.Mocked<StockHistoryGateway> = {
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

        stockHistoryGateway.findById.mockResolvedValueOnce(null);

        const useCase = DeleteStockHistoryUseCase.create(
            stockHistoryGateway,
            stockGateway,
        );
        await expect(
            useCase.execute({
                id: 3,
            }),
        ).rejects.toThrow(NotFound);

        expect(stockHistoryGateway.findById).toHaveBeenCalledWith(3);
        expect(stockHistoryGateway.listByStockId).not.toHaveBeenCalled();

        expect(stockHistoryGateway.delete).not.toHaveBeenCalled();
        expect(stockHistoryGateway.updateMany).not.toHaveBeenCalled();

        expect(stockGateway.findById).not.toHaveBeenCalled();
        expect(stockGateway.update).not.toHaveBeenCalled();
    });

    it("should throw NotFound when timeline cannot be found", async () => {
        const stockHistoryGateway: jest.Mocked<StockHistoryGateway> = {
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

        stockHistoryGateway.findById.mockResolvedValueOnce(restorePolished);

        stockHistoryGateway.listByStockId.mockResolvedValueOnce(null);

        const useCase = DeleteStockHistoryUseCase.create(
            stockHistoryGateway,
            stockGateway,
        );

        await expect(
            useCase.execute({
                id: 3,
            }),
        ).rejects.toThrow(NotFound);

        expect(stockHistoryGateway.findById).toHaveBeenCalledWith(3);
        expect(stockHistoryGateway.listByStockId).toHaveBeenCalledWith(1);

        expect(stockHistoryGateway.delete).not.toHaveBeenCalled();
        expect(stockHistoryGateway.updateMany).not.toHaveBeenCalled();

        expect(stockGateway.findById).not.toHaveBeenCalled();
        expect(stockGateway.update).not.toHaveBeenCalled();
    });

    it("should throw NotFound when stock cannot be found", async () => {
        const stockHistoryGateway: jest.Mocked<StockHistoryGateway> = {
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

        stockHistoryGateway.findById.mockResolvedValueOnce(restorePolished);

        stockHistoryGateway.listByStockId.mockResolvedValueOnce(allTimeline);

        stockGateway.findById.mockResolvedValueOnce(null);

        const useCase = DeleteStockHistoryUseCase.create(
            stockHistoryGateway,
            stockGateway,
        );

        await expect(
            useCase.execute({
                id: 3,
            }),
        ).rejects.toThrow(NotFound);

        expect(stockHistoryGateway.findById).toHaveBeenCalledWith(3);
        expect(stockHistoryGateway.listByStockId).toHaveBeenCalledWith(1);

        expect(stockHistoryGateway.delete).toHaveBeenCalledWith(3);
        expect(stockHistoryGateway.updateMany).not.toHaveBeenCalled();

        expect(stockGateway.findById).toHaveBeenCalledWith(1);
        expect(stockGateway.update).not.toHaveBeenCalled();
    });
});
