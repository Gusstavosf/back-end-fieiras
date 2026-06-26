import IncorrectRequest from "../../../core/shared/errors/incorrectRequest.js";
import type { StockHistory } from "./stock-history.js";

export enum StatusFieira {
    New = "new",
    Requested = "requested",
    Dead = "dead",
    Polished = "polished",
}

export type StockProps = {
    id?: number;
    cabinetId: number;
    code: string;
    status: StatusFieira;
    currentThickness?: number | null;
    currentWidth?: number | null;
    utilization: number;
    production: number;
    createdAt: Date;
    updatedAt: Date;
};

export class Stock {
    private constructor(private readonly props: StockProps) {}

    public static create(cabinetId: number, code: string) {
        return new Stock({
            cabinetId,
            code,
            status: StatusFieira.Requested,
            utilization: 0,
            production: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    }

    public static restore(props: StockProps) {
        return new Stock(props);
    }

    public update(
        newStatus: StatusFieira,
        details?: {
            thickness: number;
            width: number;
            production: number;
        },
    ): void {
        if (this.props.status === StatusFieira.Dead) {
            throw new IncorrectRequest(
                `A fieira ${this.props.code} está morta e não pode mais receber nenhuma atualização.`,
            );
        }

        if (this.props.status === newStatus && newStatus !== StatusFieira.Polished) {
            throw new IncorrectRequest(
                `A fieira ${this.props.code} já está no estado de '${newStatus}'.`,
            );
        }

        if (
            this.props.status === StatusFieira.Requested &&
            newStatus !== StatusFieira.New
        ) {
            throw new IncorrectRequest(
                `A fieira ${this.props.code} está com status de Requisição e precisa se tornar Nova antes de qualquer outra ação.`,
            );
        }

        if (
            this.props.status === StatusFieira.New &&
            newStatus === StatusFieira.Requested
        ) {
            throw new IncorrectRequest(
                `A fieira ${this.props.code} já foi inicializada como Nova e não pode retornar para Requisição.`,
            );
        }

        // 3. Se é Polida, não pode regredir para Nova ou Requisição
        if (this.props.status === StatusFieira.Polished) {
            if (newStatus === StatusFieira.New || newStatus === StatusFieira.Requested) {
                throw new IncorrectRequest(
                    `A fieira ${this.props.code} já está em processo de polimento e não pode retornar para Nova ou Requisição.`,
                );
            }
        }

        if (newStatus === StatusFieira.New) {
            this.props.production = 0;
            this.props.utilization = 0;
            this.props.currentThickness = null;
            this.props.currentWidth = null;
        }

        if (newStatus === StatusFieira.Dead || newStatus === StatusFieira.Polished) {
            if (!details) {
                throw new IncorrectRequest(
                    `Para alterar o status para ${newStatus}, os campos de produção, largura e espessura são obrigatórios.`,
                );
            }

            if (details.thickness <= 0 || details.width <= 0 || details.production <= 0) {
                throw new IncorrectRequest(
                    "As medidas da fieira e informações de produção devem ser maiores que zero.",
                );
            }

            if (
                this.props.currentThickness &&
                details.thickness < this.props.currentThickness
            ) {
                throw new IncorrectRequest(
                    `A nova espessura (${details.thickness}) não pode ser menor que a espessura atual (${this.props.currentThickness}).`,
                );
            }

            if (this.props.currentWidth && details.width < this.props.currentWidth) {
                throw new IncorrectRequest(
                    `A nova largura (${details.width}) não pode ser menor que a largura atual (${this.props.currentWidth}).`,
                );
            }

            this.props.currentThickness = details.thickness;
            this.props.currentWidth = details.width;
            this.props.production = (this.props.production ?? 0) + details.production;
            this.props.utilization = this.props.utilization + 1;
        }

        this.props.status = newStatus;
        this.props.updatedAt = new Date();
    }

    public recalculateFromHistory(timeline: StockHistory[]): void {
        this.props.production = 0;
        this.props.utilization = 0;
        this.props.currentThickness = null;
        this.props.currentWidth = null;

        const sortedTimeLine = [...timeline].sort((a, b) => a.id - b.id);

        for (const history of sortedTimeLine) {
            this.props.production += history.production;
            this.props.utilization += history.utilization;

            if (history.thickness !== undefined && history.thickness !== null) {
                this.props.currentThickness = history.thickness;
            }
            if (history.width !== undefined && history.width !== null) {
                this.props.currentWidth = history.width;
            }

            this.props.status = history.status;
        }

        this.props.updatedAt = new Date();
    }

    public get id(): number | undefined {
        return this.props.id;
    }
    public get cabinetId(): number {
        return this.props.cabinetId;
    }
    public get code(): string {
        return this.props.code;
    }
    public get status(): StatusFieira {
        return this.props.status;
    }
    public get createdAt(): Date {
        return this.props.createdAt;
    }
    public get updatedAt(): Date {
        return this.props.updatedAt;
    }

    public get currentThickness(): number | null {
        return this.props.currentThickness || null;
    }
    public get currentWidth(): number | null {
        return this.props.currentWidth || null;
    }
    public get utilization(): number {
        return this.props.utilization;
    }
    public get production(): number {
        return this.props.production;
    }
}
