import IncorrectRequest from "../../../core/shared/errors/incorrectRequest.js";
import { Stock, StatusFieira } from "./stock.js";

const validDetails = {
    thickness: 10,
    width: 20,
    production: 100,
};

function makeStock() {
    return Stock.create(1, "A01");
}

function makePolishedStock() {
    const stock = makeStock();

    stock.update(StatusFieira.New);

    stock.update(StatusFieira.Polished, validDetails);

    return stock;
}

function makeDeadStock() {
    const stock = makeStock();

    stock.update(StatusFieira.New);

    stock.update(StatusFieira.Polished, validDetails);

    stock.update(StatusFieira.Dead, {
        thickness: 10,
        width: 20,
        production: 100,
    });

    return stock;
}

describe("Stock.create()", () => {
    it("should create a stock with requested status", () => {
        const stock = makeStock();

        expect(stock.fieiraId).toBe(1);
        expect(stock.code).toBe("A01");
        expect(stock.status).toBe(StatusFieira.Requested);
        expect(stock.currentThickness).toBeNull();
        expect(stock.currentWidth).toBeNull();
        expect(stock.utilization).toBe(0);
        expect(stock.production).toBe(0);
        expect(stock.createdAt).toBeInstanceOf(Date);
        expect(stock.updatedAt).toBeInstanceOf(Date);
    });
});

describe("Stock.update", () => {
    it("should change status from requested to new", () => {
        const stock = makeStock();

        stock.update(StatusFieira.New);

        expect(stock.status).toBe(StatusFieira.New);
        expect(stock.production).toBe(0);
        expect(stock.utilization).toBe(0);
        expect(stock.currentThickness).toBeNull();
        expect(stock.currentWidth).toBeNull();
    });

    it("should throw when changing from requested directly to polished", () => {
        const stock = makeStock();

        expect(() =>
            stock.update(StatusFieira.Polished, {
                thickness: 10,
                width: 20,
                production: 100,
            }),
        ).toThrow(IncorrectRequest);
    });

    it("should throw when changing from new to requested", () => {
        const stock = makeStock();

        stock.update(StatusFieira.New);

        expect(() => stock.update(StatusFieira.Requested)).toThrow(IncorrectRequest);
    });

    it("should throw when changing from polished to new.", () => {
        const stock = makePolishedStock();

        expect(() => stock.update(StatusFieira.New)).toThrow(IncorrectRequest);
    });

    it("should throw when changing from polished to requested.", () => {
        const stock = makePolishedStock();

        expect(() => stock.update(StatusFieira.Requested)).toThrow(IncorrectRequest);
    });

    it("should not allow updating a dead stock.", () => {
        const stock = makeDeadStock();

        expect(() => stock.update(StatusFieira.Polished)).toThrow(IncorrectRequest);
    });

    it("should not allow updating to same status", () => {
        const stock = makeStock();

        stock.update(StatusFieira.New);

        expect(() => stock.update(StatusFieira.New)).toThrow(IncorrectRequest);
    });

    it("should throw when production details are missing", () => {
        const stock = makeStock();

        stock.update(StatusFieira.New);

        expect(() => stock.update(StatusFieira.Polished)).toThrow(IncorrectRequest);
    });

    it("should throw when thickness is less than or equal to zero", () => {
        const stock = makeStock();

        stock.update(StatusFieira.New);

        expect(() =>
            stock.update(StatusFieira.Polished, {
                thickness: -1,
                width: 20,
                production: 100,
            }),
        ).toThrow(IncorrectRequest);
    });

    it("should throw when width is less than or equal to zero", () => {
        const stock = makeStock();

        stock.update(StatusFieira.New);

        expect(() =>
            stock.update(StatusFieira.Polished, {
                thickness: 10,
                width: 0,
                production: 100,
            }),
        ).toThrow(IncorrectRequest);
    });

    it("should throw when production is less than or equal to zero", () => {
        const stock = makeStock();

        stock.update(StatusFieira.New);

        expect(() =>
            stock.update(StatusFieira.Polished, {
                thickness: 10,
                width: 20,
                production: 0,
            }),
        ).toThrow(IncorrectRequest);
    });

    it("should throw when thickness is less than the current thickness", () => {
        const stock = makeStock();

        stock.update(StatusFieira.New);

        stock.update(StatusFieira.Polished, validDetails);

        expect(() =>
            stock.update(StatusFieira.Polished, {
                thickness: 9,
                width: 20,
                production: 100,
            }),
        ).toThrow(IncorrectRequest);
    });

    it("should throw when width is less than the current width", () => {
        const stock = makeStock();

        stock.update(StatusFieira.New);

        stock.update(StatusFieira.Polished, validDetails);

        expect(() =>
            stock.update(StatusFieira.Polished, {
                thickness: 10,
                width: 19,
                production: 100,
            }),
        ).toThrow(IncorrectRequest);
    });

    it("should update to polished with valid production details", () => {
        const stock = makeStock();

        stock.update(StatusFieira.New);

        stock.update(StatusFieira.Polished, validDetails);

        stock.update(StatusFieira.Polished, {
            thickness: 11,
            width: 21,
            production: 100,
        });

        expect(stock.status).toBe(StatusFieira.Polished);
        expect(stock.currentThickness).toBe(11);
        expect(stock.currentWidth).toBe(21);
        expect(stock.production).toBe(200);
        expect(stock.utilization).toBe(2);
    });
});
