import type { Api } from "../api.js";
import express, { type Express } from 'express';
import type { Route } from "./routes/route.js";
import ErrorHandler from "../../middlewares/errorHandler.js";

export class Apiexpress implements Api {
    private app: Express;

    private routes: Route[];

    private constructor(routes: Route[]) {
        this.app = express();
        this.app.use(express.json());
        this.routes = routes; 
        this.addRoutes();
        this.app.use(ErrorHandler)
    }

    public static create(routes: Route[]) {
        return new Apiexpress(routes);
    }

    private addRoutes() {
        this.routes.forEach((route) => {
            const path = route.getPath();
            const method = route.getMethod().toLocaleLowerCase();
            const middlewares = route.getMiddlewares ? route.getMiddlewares() : [];
            const handler = route.getHandler();

            (this.app as any)[method](path, ...middlewares, handler);
        });
    }

    public start(port: number) {
        this.app.listen(port, () => {
            console.log(`🚀 Server running on port ${port}`);
            this.listRoutes();
        });
    }

    public listRoutes() {
        const activeRoutes = this.routes.map((route) => ({
            path: route.getPath(),
            method: route.getMethod().toUpperCase(),
        }));

        console.table(activeRoutes);
    }
}