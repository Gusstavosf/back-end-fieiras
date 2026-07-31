import request from "supertest";
import { app } from "../../../../../../app.js";

describe("POST /stock", () => {
    it.only("should create stock successfully", async () => {
        const fieira = {
            cabinetName: "CTC001",
            code: "A01",
        };

        const response = await request(app).post("/stock").send(fieira);

        console.log(response.status);
        console.log(response.body);

        expect(response.status).toBe(201);
        expect(response.body).toEqual({
            fieiraId: expect.any(Number),
            code: "A01",
            status: expect.any(String),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
        });
    });

    it("should not create duplicated stock", async () => {
        const fieira = {
            cabinetName: "CTC001",
            code: "A02",
        };

        await request(app).post("/stock").send(fieira);

        const response = await request(app).post("/stock").send(fieira);

        expect(response.status).toBe(400);
        expect(response.body.message).toContain(
            "A fieira A02 já está cadastrada neste armário",
        );
    });

    it("should return 400 when cabinet name is invalid", async () => {
        const response = await request(app).post("/stock").send({
            cabinetName: "ABC",
            code: "A02",
        });

        expect(response.status).toBe(400);
    });

    it("should return 400 when code is invalid", async () => {
        const response = await request(app).post("/stock").send({
            cabinetName: "CTC001",
            code: "123",
        });

        expect(response.status).toBe(400);
    });
});
