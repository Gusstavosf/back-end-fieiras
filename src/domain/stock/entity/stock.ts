import IncorrectRequest from "../../../core/shared/errors/incorrectRequest.js";

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
            utilization: number;
        },
    ): void {
        if (this.props.status === StatusFieira.Dead) {
            throw new IncorrectRequest(
                `A fieira "${this.props.code}" está morta e não pode mais ser atualizada.`,
            );
        }

        if (this.props.status === StatusFieira.New) {
            if (newStatus === StatusFieira.Requested) {
                throw new IncorrectRequest(
                    `A fieira ${this.props.code} está com status de Nova e não pode voltar a ter status de Requisição.`,
                );
            }
        }

        if (this.props.status === StatusFieira.Requested) {
            if (newStatus === StatusFieira.Polished || newStatus === StatusFieira.Dead) {
                throw new IncorrectRequest(
                    `A fieira ${this.props.code} está com status de Requisição e deve ter status de Nova antes de ser Polida ou Morta.`,
                );
            }
        }

        if (this.props.status === StatusFieira.Polished) {
            if (newStatus == StatusFieira.New || newStatus == StatusFieira.Requested) {
                throw new IncorrectRequest(
                    `A fieira ${this.props.code} está com status de Polida e não pode ter o status de Nova ou Requisição novamente`,
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
                    `Para alterar o status para ${newStatus}, os dados de produção, utilização, largura e espessura são obrigatórios.`,
                );
            }

            if (
                details.thickness <= 0 ||
                details.width <= 0 ||
                details.production <= 0 ||
                details.utilization <= 0
            ) {
                throw new IncorrectRequest(
                    "As medidas da fieira e informações de produção devem ser maiores que zero.",
                );
            }

            if (details.thickness == null || details.width == null) {
                throw new IncorrectRequest(
                    `Para fieiras com status de Morta ou Polida, os campos dimensionais não podem ser nulos.`,
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
            this.props.utilization += 1;
        }

        if (this.props.status === newStatus) {
            return;
        }

        this.props.status = newStatus;
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
