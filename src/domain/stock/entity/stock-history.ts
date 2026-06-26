import { StatusFieira } from "./stock.js";
import IncorrectRequest from "../../../core/shared/errors/incorrectRequest.js";

export type StockHistoryProps = {
    id: number;
    stockFieiraId: number;
    status: StatusFieira;
    thickness?: number | null;
    width?: number | null;
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
        newStatus: StatusFieira,
        newThickness: number | null | undefined,
        newWidth: number | null | undefined,
        newProduction: number | undefined,
        timeline: StockHistory[],
    ): void {
        const targetStatus = newStatus !== undefined ? newStatus : this.props.status;
        const targetThickness =
            newThickness !== undefined ? newThickness : this.props.thickness;
        const targetWidth = newWidth !== undefined ? newWidth : this.props.width;
        const targetProduction =
            newProduction !== undefined ? newProduction : this.props.production;

        const sortedTimeline = [...timeline].sort((a, b) => a.id! - b.id!);
        const currentIndex = sortedTimeline.findIndex((h) => h.id === this.id);
        const previousHistories = sortedTimeline.slice(0, currentIndex);
        const nextHistories = sortedTimeline.slice(currentIndex + 1);

        if (newStatus !== undefined && this.props.status === newStatus) {
            throw new IncorrectRequest(
                `O registro de histórico já está com o status de ${newStatus}.`,
            );
        }

        if (targetStatus === StatusFieira.Requested) {
            throw new IncorrectRequest(
                "Não é permitido retornar uma fieira para o status de Requisição. Caso seja necessário desfazer o histórico, exclua os registros posteriores e mantenha apenas o registro inicial de Requisição.",
            );
        }

        if (this.props.status === StatusFieira.New) {
            throw new IncorrectRequest(
                "Registros com status Nova não podem ser alterados. Caso o recebimento tenha sido registrado incorretamente, exclua este registro.",
            );
        }

        if (this.props.status === StatusFieira.Polished) {
            if (targetStatus === StatusFieira.New) {
                if (
                    targetThickness !== null ||
                    targetWidth !== null ||
                    targetProduction !== 0
                ) {
                    throw new IncorrectRequest(
                        "Para voltar uma fieira Polida para Nova, as dimensões devem ser nulas e a produção deve ser zero.",
                    );
                }

                const hasPolishedBefore = previousHistories.some(
                    (h) => h.status === StatusFieira.Polished,
                );
                if (hasPolishedBefore) {
                    throw new IncorrectRequest(
                        "Não é possível voltar o status para Nova porque já existem registros de utilização anteriores a este.",
                    );
                }
            }

            if (targetStatus === StatusFieira.Dead) {
                if (
                    !targetProduction ||
                    targetProduction <= 0 ||
                    !targetThickness ||
                    targetThickness <= 0 ||
                    !targetWidth ||
                    targetWidth <= 0
                ) {
                    throw new IncorrectRequest(
                        "Para alterar para Morta, os campos de produção e dimensões devem ser maiores que zero.",
                    );
                }

                const hasPolishedAfter = nextHistories.some(
                    (h) => h.status === StatusFieira.Polished,
                );
                if (hasPolishedAfter) {
                    throw new IncorrectRequest(
                        "Só é possível alterar de Polida para Morta se este for o último registro de polimento.",
                    );
                }

                const lastPolishedWithMeasures = [...previousHistories]
                    .reverse()
                    .find((h) => h.thickness !== null && h.width !== null);

                if (lastPolishedWithMeasures) {
                    if (
                        targetThickness < lastPolishedWithMeasures.thickness! ||
                        targetWidth < lastPolishedWithMeasures.width!
                    ) {
                        throw new IncorrectRequest(
                            `As dimensões não podem ser menores que o último registro válido (Espessura: ${lastPolishedWithMeasures.thickness}, Largura: ${lastPolishedWithMeasures.width}).`,
                        );
                    }
                }
            }
        }

        if (this.props.status === StatusFieira.Dead) {
            if (targetStatus === StatusFieira.New) {
                throw new IncorrectRequest(
                    "A partir do status de Morta, não é possível retornar para Nova ou Requisição.",
                );
            }

            if (targetStatus === StatusFieira.Polished) {
                if (
                    targetProduction === undefined ||
                    targetProduction === null ||
                    targetProduction <= 0 ||
                    targetThickness === undefined ||
                    targetThickness === null ||
                    targetThickness <= 0 ||
                    targetWidth === undefined ||
                    targetWidth === null ||
                    targetWidth <= 0
                ) {
                    throw new IncorrectRequest(
                        "Para retornar para Polida, os campos de produção e dimensões são obrigatórios e devem ser maiores que zero.",
                    );
                }

                const lastValidMeasure = [...previousHistories]
                    .reverse()
                    .find((h) => h.thickness !== null && h.width !== null);

                if (lastValidMeasure) {
                    if (
                        targetThickness! < lastValidMeasure.thickness! ||
                        targetWidth! < lastValidMeasure.width!
                    ) {
                        throw new IncorrectRequest(
                            `A nova dimensão não pode ser menor que a última registrada (Espessura: ${lastValidMeasure.thickness}, Largura: ${lastValidMeasure.width}).`,
                        );
                    }
                }
            }
        }

        this.props.status = targetStatus;
        this.props.thickness = targetThickness ?? null;
        this.props.width = targetWidth ?? null;
        this.props.production = targetProduction;
        this.props.updatedAt = new Date();
    }

    public get id(): number {
        return this.props.id;
    }

    public get stockFieiraId(): number {
        return this.props.stockFieiraId;
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

    public get thickness(): number | null {
        return this.props.thickness || null;
    }
    public get width(): number | null {
        return this.props.width || null;
    }
    public get utilization(): number {
        return this.props.utilization;
    }
    public get production(): number {
        return this.props.production;
    }
}
