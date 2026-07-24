import type { RequestHandler } from "express";

export type HttpMethod = "get" | "post" | "put" | "patch" | "delete";

export const HttpMethod = {
    GET: "get" as HttpMethod,
    POST: "post" as HttpMethod,
    PUT: "put" as HttpMethod,
    PATCH: "patch" as HttpMethod,
    DELETE: "delete" as HttpMethod,
} as const;

export interface Route {
    getHandler(): RequestHandler;
    getPath(): string;
    getMethod(): HttpMethod;
    getMiddlewares?(): RequestHandler[];
}
