import { jest } from "@jest/globals";
import type { StockGateway } from "../../../domain/stock/gateway/stock.gateway.js";
import { Stock, StatusFieira } from "../../../domain/stock/entity/stock.js";
import { ListStockUseCase } from "./list-stock.usecase.js";

describe("ListStockUseCase.execute()", () => {
    it("should list stocks successfully", async () => {
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

        const stockList = [stock];

        stockGateway.list.mockResolvedValue(stockList);

        const useCase = ListStockUseCase.create(stockGateway);

        const output = await useCase.execute();

        expect(stockGateway.list).toHaveBeenCalledTimes(1);

        expect(output).toEqual({
            stock: [
                {
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
                },
            ],
        });
    });

    it("should return an empty list when no stocks exist", async () => {
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

        stockGateway.list.mockResolvedValue([]);

        const useCase = ListStockUseCase.create(stockGateway);

        const output = await useCase.execute();

        expect(stockGateway.list).toHaveBeenCalledTimes(1);

        expect(output).toEqual({
            stock: [],
        });
    });
});
