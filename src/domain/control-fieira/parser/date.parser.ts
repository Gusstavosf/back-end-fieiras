export class DateParser {
    public parse(value: string): Date {
        const [day, month, year] = value.split(".").map(Number);

        if (!day || !month || !year) {
            throw new Error(`Data inválida: ${value}`);
        }

        return new Date(year, month - 1, day);
    }
}
