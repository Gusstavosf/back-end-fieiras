import IncorrectRequest from "../../../core/shared/errors/incorrectRequest.js";
import { StockHistory } from "./stock-history.js";
import { StatusFieira } from "./stock.js";

function makeStockHistoryRequested() {
    return StockHistory.restore({
        id: 1,
        stockFieiraId: 1,
        status: StatusFieira.Requested,
        production: 0,
        utilization: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
    });
}

function makeStockHistoryNew() {
    return StockHistory.restore({
        id: 1,
        stockFieiraId: 1,
        status: StatusFieira.New,
        production: 0,
        utilization: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
    });
}

function makeStockHistoryPolishedFirst() {
    return StockHistory.restore({
        id: 1,
        stockFieiraId: 1,
        status: StatusFieira.Polished,
        thickness: 4,
        width: 2,
        production: 100,
        utilization: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
    });
}

function makeStockHistoryPolishedtSecond() {
    return StockHistory.restore({
        id: 1,
        stockFieiraId: 1,
        status: StatusFieira.Polished,
        thickness: 4,
        width: 2,
        production: 100,
        utilization: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
    });
}

function makeStockHistoryPolishedtThird() {
    return StockHistory.restore({
        id: 1,
        stockFieiraId: 1,
        status: StatusFieira.Polished,
        thickness: 4,
        width: 2,
        production: 100,
        utilization: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
    });
}

function makeStockHistoryDead() {
    return StockHistory.restore({
        id: 1,
        stockFieiraId: 1,
        status: StatusFieira.Dead,
        thickness: 4,
        width: 2,
        production: 100,
        utilization: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
    });
}

describe("CorrectMeasures", () => {
    it("should throw when production is less than or equal to zero", () => {});
});
