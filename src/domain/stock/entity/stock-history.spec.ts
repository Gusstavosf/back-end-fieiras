import IncorrectRequest from "../../../core/shared/errors/incorrectRequest.js";
import { StockHistory } from "./stock-history.js";
import { StatusFieira } from "./stock.js";

function makeStockHistoryRequested(overrides: Partial<StockHistory> = {}) {
    return StockHistory.restore({
        id: 1,
        stockFieiraId: 1,
        status: StatusFieira.Requested,
        production: 0,
        utilization: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...overrides,
    });
}

function makeStockHistoryNew(overrides: Partial<StockHistory> = {}) {
    return StockHistory.restore({
        id: 2,
        stockFieiraId: 1,
        status: StatusFieira.New,
        production: 0,
        utilization: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...overrides,
    });
}

function makeStockHistoryPolished(overrides: Partial<StockHistory> = {}) {
    return StockHistory.restore({
        id: 3,
        stockFieiraId: 1,
        status: StatusFieira.Polished,
        thickness: 4,
        width: 2,
        production: 100,
        utilization: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...overrides,
    });
}

function makeStockHistoryDead(overrides: Partial<StockHistory> = {}) {
    return StockHistory.restore({
        id: 4,
        stockFieiraId: 1,
        status: StatusFieira.Dead,
        thickness: 4,
        width: 2,
        production: 100,
        utilization: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...overrides,
    });
}

describe("StockHistory.correctMeasures()", () => {
    describe("measure validations", () => {
        it("should throw when thickness is less than or equal to zero", () => {
            const stockHistory = makeStockHistoryPolished({
                width: -4,
            });

            const timeline = [stockHistory];

            expect(() => stockHistory.correctMeasures(timeline)).toThrow(
                IncorrectRequest,
            );
        });

        it("should throw when width is less than or equal to zero", () => {
            const stockHistory = makeStockHistoryPolished({
                width: -2,
            });

            const timeline = [stockHistory];

            expect(() => stockHistory.correctMeasures(timeline)).toThrow(
                IncorrectRequest,
            );
        });

        it("should throw when production is less than or equal to zero", () => {
            const stockHistory = makeStockHistoryPolished({
                production: -100,
            });

            const timeline = [stockHistory];

            expect(() => stockHistory.correctMeasures(timeline)).toThrow(
                IncorrectRequest,
            );
        });
    });

    describe("validate data change", () => {
        it("should throw when no data has changed", () => {
            const stockHistory = makeStockHistoryPolished({});

            const timeline = [stockHistory];

            expect(() => stockHistory.correctMeasures(timeline)).toThrow(
                IncorrectRequest,
            );
        });
    });

    describe("requested status validation", () => {
        it("should throw when changing to requested status", () => {
            const stockHistory = makeStockHistoryPolished({
                status: StatusFieira.Requested,
            });

            const timeline = [stockHistory];

            expect(() => stockHistory.correctMeasures(timeline)).toThrow(
                IncorrectRequest,
            );
        });
    });

    describe("new status validation", () => {
        it("should throw when updating a stock history with new status", () => {
            const stockHistoryNew = makeStockHistoryNew({
                status: StatusFieira.Polished,
            });

            const timeline = [stockHistoryNew];

            expect(() => stockHistoryNew.correctMeasures(timeline)).toThrow(
                IncorrectRequest,
            );
        });
    });

    describe("polished status validation", () => {
        describe("validate polished status", () => {
            it("should throw when production is less than or equal to zero ", () => {
                const stockHistory = makeStockHistoryPolished({
                    production: -1,
                });

                const timeline = [stockHistory];

                expect(() => stockHistory.correctMeasures(timeline)).toThrow(
                    IncorrectRequest,
                );
            });
        });

        describe("validate from polished to new status", () => {
            it("should throw when changing a polished history record to new when previous history polished already exists.", () => {
                const stockHistoryRequested = makeStockHistoryRequested();
                const stockHistoryNew = makeStockHistoryNew();
                const stockHistoryPolished = makeStockHistoryPolished();
                const stockHistoryBeingCorrected = makeStockHistoryPolished({
                    status: StatusFieira.New,
                });

                const timeline = [
                    stockHistoryRequested,
                    stockHistoryNew,
                    stockHistoryPolished,
                    stockHistoryBeingCorrected,
                ];

                expect(() =>
                    stockHistoryBeingCorrected.correctMeasures(timeline),
                ).toThrow(IncorrectRequest);
            });

            it("should throw when changing a polished history record to new", () => {
                const stockHistoryRequested = makeStockHistoryRequested();
                const stockHistoryNew = makeStockHistoryNew();
                const stockHistoryPolished = makeStockHistoryPolished({
                    status: StatusFieira.New,
                });

                const timeline = [
                    stockHistoryRequested,
                    stockHistoryNew,
                    stockHistoryPolished,
                ];

                expect(() => stockHistoryPolished.correctMeasures(timeline)).toThrow(
                    IncorrectRequest,
                );
            });
        });

        describe("validate from polished to dead status", () => {
            it("should throw when production is less than or equal to zero ", () => {
                const stockHistory = makeStockHistoryPolished({
                    status: StatusFieira.Dead,
                    production: -1,
                });

                const timeline = [stockHistory];

                expect(() => stockHistory.correctMeasures(timeline)).toThrow(
                    IncorrectRequest,
                );
            });

            it("should throw when thickness is less than or equal to zero", () => {
                const stockHistory = makeStockHistoryPolished({
                    status: StatusFieira.Dead,
                    thickness: -1,
                });

                const timeline = [stockHistory];

                expect(() => stockHistory.correctMeasures(timeline)).toThrow(
                    IncorrectRequest,
                );
            });

            it("should throw when width is less than or equal to zero", () => {
                const stockHistory = makeStockHistoryPolished({
                    status: StatusFieira.Dead,
                    width: -1,
                });

                const timeline = [stockHistory];

                expect(() => stockHistory.correctMeasures(timeline)).toThrow(
                    IncorrectRequest,
                );
            });

            it("should throw when changing to dead when a subsequent polished history record exists.", () => {
                const stockHistoryRequested = makeStockHistoryRequested({ id: 1 });
                const stockHistoryNew = makeStockHistoryNew({ id: 2 });
                const stockHistoryBeingCorrected = makeStockHistoryPolished({
                    id: 3,
                    status: StatusFieira.Dead,
                });
                const stockHistoryPolished = makeStockHistoryPolished({ id: 4 });

                const timeline = [
                    stockHistoryRequested,
                    stockHistoryNew,
                    stockHistoryBeingCorrected,
                    stockHistoryPolished,
                ];

                expect(() =>
                    stockHistoryBeingCorrected.correctMeasures(timeline),
                ).toThrow(IncorrectRequest);
            });

            it("should throw when changing to dead when a subsequent dead history record exists.", () => {
                const stockHistoryRequested = makeStockHistoryRequested({ id: 1 });
                const stockHistoryNew = makeStockHistoryNew({ id: 2 });
                const stockHistoryBeingCorrected = makeStockHistoryPolished({
                    id: 3,
                    status: StatusFieira.Dead,
                });
                const stockHistoryDead = makeStockHistoryDead({ id: 4 });

                const timeline = [
                    stockHistoryRequested,
                    stockHistoryNew,
                    stockHistoryBeingCorrected,
                    stockHistoryDead,
                ];

                expect(() =>
                    stockHistoryBeingCorrected.correctMeasures(timeline),
                ).toThrow(IncorrectRequest);
            });
        });
    });

    describe("dead status validation", () => {
        describe("validate dead status", () => {
            it("should throw when production is less than or equal to zero ", () => {
                const stockHistory = makeStockHistoryDead({
                    production: -1,
                });

                const timeline = [stockHistory];

                expect(() => stockHistory.correctMeasures(timeline)).toThrow(
                    IncorrectRequest,
                );
            });

            it("should throw when changing from dead to new if a previous polished record exists", () => {
                const stockHistoryRequested = makeStockHistoryRequested({ id: 1 });
                const stockHistoryNew = makeStockHistoryNew({ id: 2 });
                const stockHistoryPolished = makeStockHistoryPolished({ id: 3 });
                const stockHistoryDead = makeStockHistoryDead({
                    id: 4,
                    status: StatusFieira.New,
                });

                const timeline = [
                    stockHistoryRequested,
                    stockHistoryNew,
                    stockHistoryPolished,
                    stockHistoryDead,
                ];

                expect(() => stockHistoryDead.correctMeasures(timeline)).toThrow(
                    IncorrectRequest,
                );
            });

            it("should throw when changing from dead to new if dead is the last record", () => {
                const stockHistoryRequested = makeStockHistoryRequested({ id: 1 });
                const stockHistoryNew = makeStockHistoryNew({ id: 2 });
                const stockHistoryDead = makeStockHistoryDead({
                    id: 3,
                    status: StatusFieira.New,
                });

                const timeline = [
                    stockHistoryRequested,
                    stockHistoryNew,
                    stockHistoryDead,
                ];

                expect(() => stockHistoryDead.correctMeasures(timeline)).toThrow(
                    IncorrectRequest,
                );
            });
        });

        describe("validate from dead to polished status", () => {
            it("should throw when production is less than or equal to zero", () => {
                const stockHistory = makeStockHistoryDead({
                    status: StatusFieira.Polished,
                    production: -1,
                });

                const timeline = [stockHistory];

                expect(() => stockHistory.correctMeasures(timeline)).toThrow(
                    IncorrectRequest,
                );
            });

            it("should throw when thickness is less than or equal to zero", () => {
                const stockHistory = makeStockHistoryDead({
                    status: StatusFieira.Polished,
                    thickness: -1,
                });

                const timeline = [stockHistory];

                expect(() => stockHistory.correctMeasures(timeline)).toThrow(
                    IncorrectRequest,
                );
            });

            it("should throw when width is less than or equal to zero", () => {
                const stockHistory = makeStockHistoryDead({
                    status: StatusFieira.Dead,
                    width: -1,
                });

                const timeline = [stockHistory];

                expect(() => stockHistory.correctMeasures(timeline)).toThrow(
                    IncorrectRequest,
                );
            });

            it("should throw when width is less than the previous width", () => {
                const stockHistoryPolished = makeStockHistoryPolished({ id: 1 });
                const stockHistoryBeingCorrected = makeStockHistoryDead({
                    id: 2,
                    status: StatusFieira.Polished,
                    width: 1,
                });

                const timeline = [stockHistoryPolished, stockHistoryBeingCorrected];

                expect(() =>
                    stockHistoryBeingCorrected.correctMeasures(timeline),
                ).toThrow(IncorrectRequest);
            });

            it("should throw when thickness is less than the previous thickness", () => {
                const stockHistoryPolished = makeStockHistoryPolished({ id: 1 });
                const stockHistoryBeingCorrected = makeStockHistoryDead({
                    id: 2,
                    status: StatusFieira.Polished,
                    thickness: 1,
                });

                const timeline = [stockHistoryPolished, stockHistoryBeingCorrected];

                expect(() =>
                    stockHistoryBeingCorrected.correctMeasures(timeline),
                ).toThrow(IncorrectRequest);
            });
        });
    });

    describe("validate dimensions between history", () => {
        it("should throw when width is less than the previous width", () => {
            const stockHistoryRequest = makeStockHistoryRequested({ id: 1 });
            const makeHistoryNew = makeStockHistoryNew({ id: 2 });
            const stockHistoryPolished = makeStockHistoryPolished({ id: 3 });
            const stockHistoryBeingCorrected = makeStockHistoryPolished({
                id: 4,
                status: StatusFieira.Polished,
                width: 1,
            });

            const timeline = [
                stockHistoryRequest,
                makeHistoryNew,
                stockHistoryPolished,
                stockHistoryBeingCorrected,
            ];

            expect(() => stockHistoryBeingCorrected.correctMeasures(timeline)).toThrow(
                IncorrectRequest,
            );
        });

        it("should throw when thickness is less than the previous thickness", () => {
            const stockHistoryRequest = makeStockHistoryRequested({ id: 1 });
            const makeHistoryNew = makeStockHistoryNew({ id: 2 });
            const stockHistoryPolished = makeStockHistoryPolished({ id: 3 });
            const stockHistoryBeingCorrected = makeStockHistoryPolished({
                id: 4,
                status: StatusFieira.Polished,
                thickness: 1,
            });

            const timeline = [
                stockHistoryRequest,
                makeHistoryNew,
                stockHistoryPolished,
                stockHistoryBeingCorrected,
            ];

            expect(() => stockHistoryBeingCorrected.correctMeasures(timeline)).toThrow(
                IncorrectRequest,
            );
        });

        it("should throw when width is greater than the next history width", () => {
            const stockHistoryRequest = makeStockHistoryRequested({ id: 1 });
            const makeHistoryNew = makeStockHistoryNew({ id: 2 });
            const stockHistoryBeingCorrected = makeStockHistoryPolished({
                id: 3,
                status: StatusFieira.Polished,
                width: 5,
            });
            const stockHistoryPolished = makeStockHistoryPolished({ id: 4 });

            const timeline = [
                stockHistoryRequest,
                makeHistoryNew,
                stockHistoryBeingCorrected,
                stockHistoryPolished,
            ];

            expect(() => stockHistoryBeingCorrected.correctMeasures(timeline)).toThrow(
                IncorrectRequest,
            );
        });

        it("should throw when thickness is greater than the next history thickness", () => {
            const stockHistoryRequest = makeStockHistoryRequested({ id: 1 });
            const makeHistoryNew = makeStockHistoryNew({ id: 2 });
            const stockHistoryBeingCorrected = makeStockHistoryPolished({
                id: 3,
                status: StatusFieira.Polished,
                thickness: 5,
            });
            const stockHistoryPolished = makeStockHistoryPolished({ id: 4 });

            const timeline = [
                stockHistoryRequest,
                makeHistoryNew,
                stockHistoryBeingCorrected,
                stockHistoryPolished,
            ];

            expect(() => stockHistoryBeingCorrected.correctMeasures(timeline)).toThrow(
                IncorrectRequest,
            );
        });
    });
});

describe("StockHistory.validateDelete()", () => {
    it("should throw when deleting record with requested status", () => {
        const stockHistoryRequest = makeStockHistoryRequested({ id: 1 });

        const timeline = [stockHistoryRequest];

        expect(() => stockHistoryRequest.validateDelete(timeline)).toThrow(
            IncorrectRequest,
        );
    });

    it("should throw when deleting a new record if a polished or dead record exists after it", () => {
        const stockHistoryRequest = makeStockHistoryRequested({ id: 1 });
        const stockHistoryNew = makeStockHistoryNew({ id: 2 });
        const stockHistoryPolished = makeStockHistoryPolished({ id: 3 });
        const stockHistoryDead = makeStockHistoryDead({ id: 4 });

        const timeline = [
            stockHistoryRequest,
            stockHistoryNew,
            stockHistoryPolished,
            stockHistoryDead,
        ];

        expect(() => stockHistoryNew.validateDelete(timeline)).toThrow(IncorrectRequest);
    });
});

describe("Stock.History.renderUtilizations()", () => {
    it("should recalculate utilization for the entire timeline", () => {
        const stockHistoryRequest = makeStockHistoryRequested({ id: 1 });
        const stockHistoryNew = makeStockHistoryNew({ id: 2 });
        const stockHistoryPolished = makeStockHistoryPolished({ id: 4 });
        const stockHistoryDead = makeStockHistoryDead({ id: 6 });

        const timeline = [
            stockHistoryRequest,
            stockHistoryNew,
            stockHistoryPolished,
            stockHistoryDead,
        ];

        stockHistoryRequest.renderUtilizations(timeline);

        expect(stockHistoryRequest.utilization).toBe(0);
        expect(stockHistoryNew.utilization).toBe(0);
        expect(stockHistoryPolished.utilization).toBe(1);
        expect(stockHistoryDead.utilization).toBe(2);
    });
});
