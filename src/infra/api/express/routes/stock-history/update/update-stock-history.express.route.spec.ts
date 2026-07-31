import request from "supertest";
import { app } from "../../../../../../app.js";

describe("UPDATE /stock/history/:id", () => {
    it("should correct production stock history successful", async () => {
        const history = {
            production: 150,
        };

        const response = await request(app).patch("/stock/history/49").send(history);

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

    it("should correct thickness stock history successful", async () => {
        const history = {
            thickness: 4.78,
        };

        const response = await request(app).patch("/stock/history/50").send(history);

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

    it("should correct width stock history successful", async () => {
        const history = {
            width: 2.75,
        };

        const response = await request(app).patch("/stock/history/50").send(history);

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

    it("should correct the status from dead to polished", async () => {
        const history = {
            status: "Polida",
        };

        const response = await request(app).patch("/stock/history/50").send(history);

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

    it("should throw an exception when thickness is lower than the previous record", async () => {
        const history = {
            thickness: 4,
        };

        const response = await request(app).patch("/stock/history/50").send(history);

        console.log(response.status);
        console.log(response.body);

        expect(response.status).toBe(400);

        expect(response.body).toEqual({
            message: expect.any(String),
            status: 400,
        });
    });

    it("should throw an exception when width is lower than the previous record", async () => {
        const history = {
            thickness: 2,
        };

        const response = await request(app).patch("/stock/history/50").send(history);

        console.log(response.status);
        console.log(response.body);

        expect(response.status).toBe(400);

        expect(response.body).toEqual({
            message: expect.any(String),
            status: 400,
        });
    });

    it("should throw an exception when thickness is greater than the next record", async () => {
        const history = {
            thickness: 5,
        };

        const response = await request(app).patch("/stock/history/49").send(history);

        console.log(response.status);
        console.log(response.body);

        expect(response.status).toBe(400);

        expect(response.body).toEqual({
            message: expect.any(String),
            status: 400,
        });
    });

    it("should throw an exception when width is greater than the next record", async () => {
        const history = {
            width: 3,
        };

        const response = await request(app).patch("/stock/history/49").send(history);

        console.log(response.status);
        console.log(response.body);

        expect(response.status).toBe(400);

        expect(response.body).toEqual({
            message: expect.any(String),
            status: 400,
        });
    });

    it("should throw an exception if there is a dead status in the subsequent records.", async () => {
        const history = {
            status: "Morta",
        };

        const response = await request(app).patch("/stock/history/48").send(history);

        console.log(response.status);
        console.log(response.body);

        expect(response.status).toBe(400);

        expect(response.body).toEqual({
            message: expect.any(String),
            status: 400,
        });
    });

    it("should throw an exception when attempting to change the fieira status from new to any other.", async () => {
        const history = {
            status: "Polida",
        };

        const response = await request(app).patch("/stock/history/45").send(history);

        console.log(response.status);
        console.log(response.body);

        expect(response.status).toBe(400);

        expect(response.body).toEqual({
            message: expect.any(String),
            status: 400,
        });
    });

    it("should throw an exception when attempting to change the fieira status from requested to any other.", async () => {
        const history = {
            status: "Polida",
        };

        const response = await request(app).patch("/stock/history/44").send(history);

        console.log(response.status);
        console.log(response.body);

        expect(response.status).toBe(400);

        expect(response.body).toEqual({
            message: expect.any(String),
            status: 400,
        });
    });

    it.only("should throw an exception when attempting to change the fieira status to new status.", async () => {
        const history = {
            status: "Nova",
        };

        const response = await request(app).patch("/stock/history/50").send(history);

        console.log(response.status);
        console.log(response.body);

        expect(response.status).toBe(400);

        expect(response.body).toEqual({
            message: expect.any(String),
            status: 400,
        });
    });
});
