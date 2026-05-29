import type { Request, Response } from "express";

export type HttMethod = "get" | "post";

export const HttpMethod ={
    GET: "get" as HttMethod,
    POST: "post" as HttMethod
} as const; 

export interface Route {
    getHandler(): (request: Request, response: Response) => Promise<void>
    getPath(): string;
    getMethod: HttMethod;
}