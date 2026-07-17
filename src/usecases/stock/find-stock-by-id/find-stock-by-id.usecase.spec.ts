import { jest } from "@jest/globals";
import type { StockGateway } from "../../../domain/stock/gateway/stock.gateway.js";
import { Stock, StatusFieira } from "../../../domain/stock/entity/stock.js";
import { FindStockByIdUseCase } from "./find-stock-by-id.usecase.js";
import NotFound from "../../../core/shared/errors/notFound.js";

describe("FindStockByIdUseCase.execute()", () => {
    it("should find stock by id successfully", async () => {
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

        const useCase = FindStockByIdUseCase.create(stockGateway);

        const output = await useCase.execute({
            id: 1,
        });

        expect(stockGateway.findById).toHaveBeenCalledWith(1);

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
            detele: jest.fn(),
        };

        const useCase = FindStockByIdUseCase.create(stockGateway);

        stockGateway.findById.mockResolvedValue(null);

        await expect(useCase.execute({ id: 1 })).rejects.toThrow(NotFound);

        expect(stockGateway.findById).toHaveBeenCalledTimes(1);
        expect(stockGateway.findById).toHaveBeenCalledWith(1);
    });
});
