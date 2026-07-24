import request from "supertest";
import { app } from "../../../../../../app.js";

describe("LIST /stock", () => {
    it("should list stock successfully", async () => {
        const response = await request(app).get("/stock");

        console.log(response.status);
        console.log(response.body);

        expect(response.status).toBe(200);

        expect(response.body).toEqual({
            stock: expect.any(Array),
        });
    });
});
