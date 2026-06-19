import { StatusFieira } from "./stock.js";
import IncorrectRequest from "../../../../core/shared/errors/incorrectRequest.js";

export type StockHistoryProps = {
    id: number;
    stockFieiraId: number;
    status: StatusFieira;
    thickness: number | null;
    width: number | null;
    production: number;
    utilization: number;
    createdAt: Date;
    updatedAt: Date;
};

export class StockHistory {
    private constructor(private readonly props: StockHistoryProps) {}

    public static restore(props: StockHistoryProps) {
        return new StockHistory(props);
    }

    public correctMeasures(
        status: StatusFieira,
        thickness: number | null,
        width: number | null,
        production: number,
        utilization: number,
    ): void {
        if (status === StatusFieira.New || status === StatusFieira.Requested) {
            if (production !== 0 || utilization !== 0) {
                throw new IncorrectRequest(
                    `Para fieiras com status de requisição ou de nova, os campos de produção e a utilização devem ser obrigatoriamente zero.`,
                );
            }

            if (thickness !== null || width !== null) {
                throw new IncorrectRequest(
                    `Para fieiras com status de Requisição ou de Nova, os campos dimensionais devem ser obrigatoriamente nulos.`,
                );
            }
        }

        if (status === StatusFieira.Polished || status === StatusFieira.Dead) {
            if (production == 0 || utilization == 0 || thickness == 0 || width == 0) {
                throw new IncorrectRequest(
                    `Para fieiras com status de Polida ou de Morta, os campos de produção, a utilização e as dimensões devem ser diferente de zero.`,
                );
            }
            if (thickness === null || width === null) {
                throw new IncorrectRequest(
                    `Para fieiras com status de Polida ou Morta, as dimensões não podem ser nulas.`,
                );
            }
            if (this.props.thickness && thickness < this.props.thickness) {
                throw new IncorrectRequest(
                    `A nova espessura (${thickness}) não pode ser menor que a espessura atual (${this.props.thickness}).`,
                );
            }

            if (this.props.width && width < this.props.width) {
                throw new IncorrectRequest(
                    `A nova largura (${width}) não pode ser menor que a largura atual (${this.props.width}).`,
                );
            }
        }

        this.props.status = status;
        this.props.thickness = thickness;
        this.props.width = width;
        this.props.production = production;
        this.props.utilization = utilization;

        this.props.updatedAt = new Date();
    }
}
