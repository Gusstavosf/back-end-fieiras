export interface Validator<T> {
    validate(data: Record<string, unknown>): T;
}
