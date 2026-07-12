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

    private validateMeasures(
        targetProduction: number,
        targetThickness: number | null,
        targetWidth: number | null,
        message: string,
    ) {
        if (
            targetProduction <= 0 ||
            targetThickness == null ||
            targetThickness <= 0 ||
            targetWidth == null ||
            targetWidth <= 0
        ) {
            throw new IncorrectRequest(message);
        }
    }

    private validateStatusChange(
        newStatus: StatusFieira,
        newThickness: number | null,
        newWidth: number | null,
        newProduction: number | null,
    ) {
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
    }

    private validateRequested(targetStatus: StatusFieira) {
        if (targetStatus === StatusFieira.Requested) {
            throw new IncorrectRequest(
                "Não é permitido retornar uma fieira para o status de Requisição. Caso seja necessário desfazer o histórico, exclua os registros posteriores e mantenha apenas o registro inicial de Requisição.",
            );
        }
    }

    private validateNew() {
        if (this.props.status === StatusFieira.New) {
            throw new IncorrectRequest(
                "Registros com status Nova não podem ser alterados. Caso o recebimento tenha sido registrado incorretamente, exclua este registro.",
            );
        }
    }

    private validatePolishedToNew(
        targetStatus: StatusFieira,
        previousHistories: StockHistory[],
    ) {
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
    }

    private validatePolishedToDead(
        targetStatus: StatusFieira,
        targetThickness: number | null,
        targetWidth: number | null,
        targetProduction: number,
        nextHistories: StockHistory[],
    ) {
        if (targetStatus === StatusFieira.Dead) {
            this.validateMeasures(
                targetProduction,
                targetThickness,
                targetWidth,
                "Para alterar para Morta, os campos de produção e dimensões devem ser maiores que zero.",
            );

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

    private validateDeadToPolished(
        targetThickness: number | null,
        targetWidth: number | null,
        targetProduction: number,
        previousHistories: StockHistory[],
    ) {
        this.validateMeasures(
            targetProduction,
            targetThickness,
            targetWidth,
            "Para retornar para Polida, os campos de produção e dimensões são obrigatórios e devem ser maiores que zero.",
        );

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

    private validatePolished(
        targetStatus: StatusFieira,
        targetThickness: number | null,
        targetWidth: number | null,
        targetProduction: number,
        previousHistories: StockHistory[],
        nextHistories: StockHistory[],
    ) {
        if (this.props.status === StatusFieira.Polished) {
            if (targetProduction <= 0) {
                throw new IncorrectRequest(
                    "A produção de uma fieira deve ser maior do que zero",
                );
            }
        }

        switch (targetStatus) {
            case StatusFieira.New:
                this.validatePolishedToNew(targetStatus, previousHistories);
                break;

            case StatusFieira.Dead:
                this.validatePolishedToDead(
                    targetStatus,
                    targetThickness,
                    targetWidth,
                    targetProduction,
                    nextHistories,
                );
                break;
        }
    }

    private validateDead(
        targetStatus: StatusFieira,
        targetThickness: number | null,
        targetWidth: number | null,
        targetProduction: number,
        previousHistories: StockHistory[],
    ) {
        if (this.props.status === StatusFieira.Dead) {
            if (targetProduction <= 0) {
                throw new IncorrectRequest(
                    "A produção de uma fieira deve ser maior do que zero",
                );
            }
            if (targetStatus === StatusFieira.New) {
                throw new IncorrectRequest(
                    "A partir do status de Morta, só é possível retornar para status de Polida.",
                );
            }

            if (targetStatus === StatusFieira.Polished) {
                this.validateDeadToPolished(
                    targetThickness,
                    targetWidth,
                    targetProduction,
                    previousHistories,
                );
            }
        }
    }

    private lastHistoryWithMeasures(
        previousHistories: StockHistory[],
    ): StockHistory | undefined {
        return [...previousHistories]
            .reverse()
            .find((history) => history.thickness !== null && history.width !== null);
    }

    private nextHistoryWithMeasures(
        nextHistories: StockHistory[],
    ): StockHistory | undefined {
        return [...nextHistories]
            .reverse()
            .find((history) => history.thickness !== null && history.width !== null);
    }

    private hasValue(value: number | null | undefined): value is number {
        return value != null;
    }

    private validateDimensionsBetweenHistory(
        targetThickness: number | null | undefined,
        targetWidth: number | null | undefined,
        previousHistories: StockHistory[],
        nextHistories: StockHistory[],
    ) {
        const last = this.lastHistoryWithMeasures(previousHistories);

        const next = this.nextHistoryWithMeasures(nextHistories);

        if (last && last.thickness !== null && last.width !== null) {
            if (
                (this.hasValue(targetThickness) && targetThickness < last.thickness) ||
                (this.hasValue(targetWidth) && targetWidth < last.width)
            ) {
                throw new IncorrectRequest(
                    `As dimensões desse registro não podem ser menores que o último registro válido (Espessura: ${last.thickness}, Largura: ${last.width}).`,
                );
            }
        }

        if (next && next.thickness !== null && next.width !== null) {
            if (
                (targetThickness !== null &&
                    targetThickness !== undefined &&
                    targetThickness > next.thickness) ||
                (targetWidth !== null &&
                    targetWidth !== undefined &&
                    targetWidth > next.width)
            ) {
                throw new IncorrectRequest(
                    `As dimensões desse registro não podem ser maior que o próximo registro válido (Espessura: ${next.thickness}, Largura: ${next.width}).`,
                );
            }
        }
    }

    public correctMeasures(
        timeline: StockHistory[],
        newStatus?: StatusFieira,
        newThickness?: number | null,
        newWidth?: number | null,
        newProduction?: number,
    ): void {
        const targetStatus = newStatus ?? this.props.status;
        const targetThickness =
            newThickness !== undefined ? newThickness : (this.props.thickness ?? null);
        const targetWidth =
            newWidth !== undefined ? newWidth : (this.props.width ?? null);
        const targetProduction = newProduction ?? this.props.production;

        const sortedTimeline = [...timeline].sort((a, b) => a.id! - b.id!);
        const currentIndex = sortedTimeline.findIndex((h) => h.id === this.id);

        const previousHistories = sortedTimeline.slice(0, currentIndex);
        const nextHistories = sortedTimeline.slice(currentIndex + 1);

        this.validateStatusChange(
            targetStatus,
            targetThickness,
            targetWidth,
            targetProduction,
        );

        this.validateDimensionsBetweenHistory(
            targetThickness,
            targetWidth,
            previousHistories,
            nextHistories,
        );

        switch (this.props.status) {
            case StatusFieira.Requested:
                this.validateRequested(targetStatus);
                break;

            case StatusFieira.New:
                this.validateNew();
                break;

            case StatusFieira.Polished:
                this.validatePolished(
                    targetStatus,
                    targetThickness,
                    targetWidth,
                    targetProduction,
                    previousHistories,
                    nextHistories,
                );
                break;

            case StatusFieira.Dead:
                this.validateDead(
                    targetStatus,
                    targetThickness,
                    targetWidth,
                    targetProduction,
                    previousHistories,
                );
                break;
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

    private updateUtilization(newUtilization: number): void {
        this.props.utilization = newUtilization;
    }

    public renderUtilizations(timeline: StockHistory[]): void {
        let counterUtilization = 1;

        for (const history of timeline) {
            if (
                history.status === StatusFieira.Polished ||
                history.status === StatusFieira.Dead
            ) {
                history.updateUtilization(counterUtilization);
                counterUtilization++;
            } else {
                history.updateUtilization(0);
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
