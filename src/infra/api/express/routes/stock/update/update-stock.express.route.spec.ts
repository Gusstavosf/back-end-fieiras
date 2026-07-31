import request from "supertest";
import { app } from "../../../../../../app.js";

describe("UPDATE /stock", () => {
    it("should update stock to New successfully", async () => {
        const fieira = {
            cabinetName: "CTC001",
            code: "A01",
            status: "Nova",
        };

        const response = await request(app).patch("/stock").send(fieira);

        console.log(response.status);
        console.log(response.body);

        expect(response.status).toBe(201);

        expect(response.body).toEqual({
            id: expect.any(Number),
            fieiraId: expect.any(Number),
            code: "A01",
            status: "new",
            currentThickness: null,
            currentWidth: null,
            production: 0,
            utilization: 0,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
        });
    });

    it.only("should update stock to Polished successfully", async () => {
        const fieira = {
            cabinetName: "CTC001",
            code: "A01",
            status: "Polida",
            thickness: 4.0,
            width: 2.5,
            production: 100,
        };

        const response = await request(app).patch("/stock").send(fieira);

        console.log(response.status);
        console.log(response.body);

        expect(response.status).toBe(201);

        expect(response.body).toEqual({
            id: expect.any(Number),
            fieiraId: expect.any(Number),
            code: "A01",
            status: "polished",
            currentThickness: 4.0,
            currentWidth: 2.5,
            utilization: 1,
            production: 100,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
        });
    });

    it("should update stock with a second polished history", async () => {
        const fieira = {
            cabinetName: "CTC001",
            code: "A01",
            status: "Polida",
            thickness: 4.2,
            width: 2.6,
            production: 100,
        };

        const response = await request(app).patch("/stock").send(fieira);

        console.log(response.status);
        console.log(response.body);

        expect(response.status).toBe(201);

        expect(response.body).toEqual({
            id: expect.any(Number),
            fieiraId: expect.any(Number),
            code: "A01",
            status: "polished",
            currentThickness: 4.2,
            currentWidth: 2.6,
            utilization: 2,
            production: 200,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
        });
    });

    it("should update stock with a third polished history", async () => {
        const fieira = {
            cabinetName: "CTC001",
            code: "A01",
            status: "Polida",
            thickness: 4.7,
            width: 2.65,
            production: 100,
        };

        const response = await request(app).patch("/stock").send(fieira);

        console.log(response.status);
        console.log(response.body);

        expect(response.status).toBe(201);

        expect(response.body).toEqual({
            id: expect.any(Number),
            fieiraId: expect.any(Number),
            code: "A01",
            status: "polished",
            currentThickness: 4.7,
            currentWidth: 2.65,
            utilization: 3,
            production: 300,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
        });
    });

    it("should update stock with a fourth polished history", async () => {
        const fieira = {
            cabinetName: "CTC001",
            code: "A01",
            status: "Polida",
            thickness: 4.75,
            width: 2.69,
            production: 100,
        };

        const response = await request(app).patch("/stock").send(fieira);

        console.log(response.status);
        console.log(response.body);

        expect(response.status).toBe(201);

        expect(response.body).toEqual({
            id: expect.any(Number),
            fieiraId: expect.any(Number),
            code: "A01",
            status: "polished",
            currentThickness: 4.75,
            currentWidth: 2.69,
            utilization: 4,
            production: 400,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
        });
    });

    it("should return 400 when production is invalid", async () => {
        const fieira = {
            cabinetName: "CTC001",
            code: "A01",
            status: "Polida",
            thickness: 4,
            width: 2,
            production: 0,
        };

        const response = await request(app).patch("/stock").send(fieira);

        console.log(response.status);
        console.log(response.body);

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            message: expect.any(String),
            status: 400,
        });
    });

    it("should return 400 when thickness is invalid", async () => {
        const fieira = {
            cabinetName: "CTC001",
            code: "A01",
            status: "Polida",
            thickness: 0,
            width: 2,
            production: 100,
        };

        const response = await request(app).patch("/stock").send(fieira);

        console.log(response.status);
        console.log(response.body);

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            message: expect.any(String),
            status: 400,
        });
    });

    it("should return 400 when width is invalid", async () => {
        const fieira = {
            cabinetName: "CTC001",
            code: "A01",
            status: "Polida",
            thickness: 4,
            width: 0,
            production: 100,
        };

        const response = await request(app).patch("/stock").send(fieira);

        console.log(response.status);
        console.log(response.body);

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            message: expect.any(String),
            status: 400,
        });
    });

    it("should not update stock when thickness is lower than the previous polished record", async () => {
        const fieira = {
            cabinetName: "CTC001",
            code: "A01",
            status: "Polida",
            thickness: 2,
            width: 2,
            production: 100,
        };

        const response = await request(app).patch("/stock").send(fieira);

        console.log(response.status);
        console.log(response.body);

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            message: expect.any(String),
            status: 400,
        });
    });

    it("should not update stock when width is lower than the previous polished record", async () => {
        const fieira = {
            cabinetName: "CTC001",
            code: "A01",
            status: "Polida",
            thickness: 4,
            width: 1,
            production: 100,
        };

        const response = await request(app).patch("/stock").send(fieira);

        console.log(response.status);
        console.log(response.body);

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            message: expect.any(String),
            status: 400,
        });
    });

    it("should update stock to Dead successfully", async () => {
        const fieira = {
            cabinetName: "CTC001",
            code: "A01",
            status: "Morta",
            thickness: 4.77,
            width: 2.72,
            production: 100,
        };

        const response = await request(app).patch("/stock").send(fieira);

        console.log(response.status);
        console.log(response.body);

        expect(response.status).toBe(201);

        expect(response.body).toEqual({
            id: expect.any(Number),
            fieiraId: expect.any(Number),
            code: "A01",
            status: "dead",
            currentThickness: 4.77,
            currentWidth: 2.72,
            production: 500,
            utilization: 5,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
        });
    });

    it("should not update stock when current status is dead", async () => {
        const fieira = {
            cabinetName: "CTC001",
            code: "A01",
            status: "Morta",
            thickness: 4,
            width: 2,
            production: 100,
        };

        const response = await request(app).patch("/stock").send(fieira);

        console.log(response.status);
        console.log(response.body);

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            message: expect.any(String),
            status: 400,
        });
    });
});
