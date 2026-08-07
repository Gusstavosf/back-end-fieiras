import { Metal } from "../entity/control-fieira.js";
import { DescriptionParser } from "./description.parser.js";

describe("", () => {
    it.only("should parse a copper wire", () => {
        const parser = new DescriptionParser();

        const result = parser.parse("CRC 3P/E KFT0,96 8,7X1,85 T 170 WPR-5061");

        expect(result).toEqual({
            material: Metal.Cu,
            wireType: "CRC P/E",
            width: 8.7,
            thickness: 1.85,
            tension: 170,
        });

        console.log(result);
    });

    it("should parse dimensions correctly", () => {});

    it("should parse tension", () => {});

    it("should ignore laminated products", () => {
        const parser = new DescriptionParser();

        const result = parser.parse("BRC 12,5X4,5X2.175mm L 60 WPS-2835");

        expect(result).toEqual(null);

        console.log(result);
    });
});
