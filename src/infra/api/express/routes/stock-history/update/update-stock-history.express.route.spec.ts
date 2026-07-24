import request from "supertest";
import { app } from "../../../../../../app.js";

describe("UPDATE /stock/history/:id", () => {
    it.only("should correct production stock history successful", async () => {
        const history = {
            production: 200,
        };

        const response = await request(app).patch("/stock/history/20").send(history);

        console.log(response.status);
        console.log(response.body);

        expect(response.status).toBe(200);

        expect(response.body).toEqual({
            id: expect.any(Number),
            status: expect.any(String),
            thickness: expect.any(Number),
            width: expect.any(Number),
            production: expect.any(Number),
            utilization: expect.any(Number),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
        });
    });

    it("should update stock to Polished successfully", async () => {
        const fieira = {
            cabinetName: "CTC001",
            code: "A01",
            status: "Polida",
            thickness: 4,
            width: 2,
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
            currentThickness: 4,
            currentWidth: 2,
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
            thickness: 4,
            width: 2,
            production: 150,
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
            currentThickness: 4,
            currentWidth: 2,
            utilization: 2,
            production: 250,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
        });
    });

    it("should update stock with a third polished history", async () => {
        const fieira = {
            cabinetName: "CTC001",
            code: "A01",
            status: "Polida",
            thickness: 4,
            width: 2,
            production: 150,
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
            currentThickness: 4,
            currentWidth: 2,
            utilization: 3,
            production: 400,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
        });
    });

    it("should update stock with a fourth polished history", async () => {
        const fieira = {
            cabinetName: "CTC001",
            code: "A01",
            status: "Polida",
            thickness: 4,
            width: 2,
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
            currentThickness: 4,
            currentWidth: 2,
            utilization: 4,
            production: 500,
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
            thickness: 4,
            width: 2,
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
            currentThickness: 4,
            currentWidth: 2,
            production: 600,
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
