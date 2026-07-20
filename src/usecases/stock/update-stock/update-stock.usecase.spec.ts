import { jest } from "@jest/globals";
import NotFound from "../../../core/shared/errors/notFound.js";
import { Stock, StatusFieira } from "../../../domain/stock/entity/stock.js";
import type { StockGateway } from "../../../domain/stock/gateway/stock.gateway.js";
import { UpdateStockUseCase } from "./update-stock.usecase.js";
import IncorrectRequest from "../../../core/shared/errors/incorrectRequest.js";

describe("UpdateStockUseCase.execute()", () => {
    it("should update stocks successfully", async () => {
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
});
