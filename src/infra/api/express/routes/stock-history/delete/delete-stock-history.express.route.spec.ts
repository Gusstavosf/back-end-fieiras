import request from "supertest";
import { app } from "../../../../../../app.js";

describe("DELETE /stock/history/:id", () => {
    it.only("should delete stock history successful", async () => {
        const response = await request(app).delete("/stock/history/51");

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

    it("should throw an exception when attempting to delete a row with new status if there are subsequent records.", async () => {
        const response = await request(app).delete("/stock/history/45");

        console.log(response.status);
        console.log(response.body);

        expect(response.status).toBe(400);

        expect(response.body).toEqual({
            message: expect.any(String),
            status: 400,
        });
    });

    it("should throw an exception when attempting to delete a row with requested status.", async () => {
        const response = await request(app).delete("/stock/history/44");

        console.log(response.status);
        console.log(response.body);

        expect(response.status).toBe(400);

        expect(response.body).toEqual({
            message: expect.any(String),
            status: 400,
        });
    });
});
