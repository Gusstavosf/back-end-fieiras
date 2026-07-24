import request from "supertest";
import { app } from "../../../../../../app.js";

describe("FIND-BY-ID /stock/:id", () => {
    it("should list stock successfully", async () => {
        const response = await request(app).get("/stock/7");

        console.log(response.status);
        console.log(response.body);

        expect(response.status).toBe(200);

        expect(response.body).toEqual({
            id: expect.any(Number),
            fieiraId: expect.any(Number),
            code: expect.any(String),
            status: expect.any(String),
            currentThickness: expect.anything(),
            currentWidth: expect.anything(),
            utilization: expect.any(Number),
            production: expect.any(Number),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
        });
    });

    it.only("should return 404 when stock does not exist", async () => {
        const response = await request(app).get("/stock/999999");

        console.log(response.status);
        console.log(response.body);

        expect(response.status).toBe(404);
        expect(response.body).toEqual({
            message: expect.any(String),
            status: 404,
        });
    });
});
