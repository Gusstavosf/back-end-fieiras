import { jest } from "@jest/globals";
import { Stock, StatusFieira } from "../../../domain/stock/entity/stock.js";
import type { StockGateway } from "../../../domain/stock/gateway/stock.gateway.js";
import { DeleteStockUseCase } from "./delete-stock.usecase.js";
import NotFound from "../../../core/shared/errors/notFound.js";

describe("DeleteStockUseCase.execute()", () => {
    it("should delete a stock successfully", async () => {
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

        const stock = Stock.restore({
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
        });

        stockGateway.findById.mockResolvedValue(stock);
        stockGateway.delete.mockResolvedValue();

        const useCase = DeleteStockUseCase.create(stockGateway);

        const output = await useCase.execute({
            id: 1,
        });

        expect(stockGateway.findById).toHaveBeenCalledWith(1);
        expect(stockGateway.delete).toHaveBeenCalledTimes(1);

        expect(output).toEqual({
            id: 1,
            fieiraId: 1,
            code: "A01",
            status: StatusFieira.Requested,
            currentThickness: null,
            currentWidth: null,
            utilization: 0,
            production: 0,
            createdAt: stock.createdAt,
            updatedAt: stock.updatedAt,
        });
    });

    it("should throw NotFound when stock does not exist", async () => {
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

        const useCase = DeleteStockUseCase.create(stockGateway);

        stockGateway.findById.mockResolvedValue(null);

        await expect(useCase.execute({ id: 1 })).rejects.toThrow(NotFound);

        expect(stockGateway.delete).not.toHaveBeenCalled();
    });
});
