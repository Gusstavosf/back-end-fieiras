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

        const hasChangeData =
            (newThickness !== undefined && newThickness !== this.props.thickness) ||
            (newWidth !== undefined && newWidth !== this.props.width) ||
            (newProduction !== undefined && newProduction !== this.props.production);

        if (
            newStatus !== undefined &&
            this.props.status === newStatus &&
            !hasChangeData
        ) {
            throw new IncorrectRequest(
                `Não é permitido corrigir os dados para o mesmo que ele já está atualmente`,
            );
        }

        const lastValidMeasures = [...previousHistories]
            .reverse()
            .find((h) => h.thickness !== null && h.width !== null);

        if (
            lastValidMeasures &&
            lastValidMeasures.thickness !== null &&
            lastValidMeasures.width !== null
        ) {
            if (
                (targetThickness !== null &&
                    targetThickness !== undefined &&
                    targetThickness < lastValidMeasures.thickness) ||
                (targetWidth !== null &&
                    targetWidth !== undefined &&
                    targetWidth < lastValidMeasures.width)
            ) {
                throw new IncorrectRequest(
                    `As dimensões não podem ser menores que o último registro válido (Espessura: ${lastValidMeasures.thickness}, Largura: ${lastValidMeasures.width}).`,
                );
            }
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
                const hasPolishedBefore = previousHistories.some(
                    (h) => h.status === StatusFieira.Polished,
                );
                if (hasPolishedBefore) {
                    throw new IncorrectRequest(
                        "Não é possível voltar o status para Nova porque já existem registros de utilização anteriores a este. Para retornar retornar para Nova exclua todos os registros de Polida.",
                    );
                }

                const hasNewBefore = previousHistories.some(
                    (h) => h.status === StatusFieira.New,
                );
                if (hasNewBefore) {
                    throw new IncorrectRequest(
                        "Para alterar o status para Nova, exclua esse registro atual de Polida.",
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

                const hasDeadAfter = nextHistories.some(
                    (h) => h.status === StatusFieira.Dead,
                );

                if (hasDeadAfter) {
                    throw new IncorrectRequest(
                        "Não é possível alterar o registro de Polida para Morta pois existem registros posteriores a esse.",
                    );
                }
            }
        }

        if (this.props.status === StatusFieira.Dead) {
            if (targetStatus === StatusFieira.New) {
                throw new IncorrectRequest(
                    "A partir do status de Morta, só é possível retornar para status de Polida.",
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

    public validateDelete(timeline: StockHistory[]): void {
        if (this.props.status === StatusFieira.Requested) {
            throw new IncorrectRequest(
                "Não é permitido excluir um registro com status de Requisição por aqui.",
            );
        }

        const sortedTimeline = [...timeline].sort((a, b) => a.id! - b.id!);
        const currentIndex = sortedTimeline.findIndex((h) => h.id === this.id);
        const nextHistories = sortedTimeline.slice(currentIndex + 1);

        if (this.props.status === StatusFieira.New) {
            const hasPolishedAfter = nextHistories.some(
                (h) => h.status === StatusFieira.Polished,
            );
            const hasDeadAfter = nextHistories.some(
                (h) => h.status === StatusFieira.Dead,
            );
            if (hasPolishedAfter || hasDeadAfter) {
                throw new IncorrectRequest(
                    "Não é permitido excluir registros com status de Nova com registros de usos posteriores.",
                );
            }
        }
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
