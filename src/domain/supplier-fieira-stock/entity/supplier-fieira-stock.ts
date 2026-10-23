import type { SupplierFieiraStockHistory } from "./supplier-fieira-stock-history.js";

export type SupplierFieiraStockProps = {
    thickness: number;
    width: number;
    quantitySent: number;
    quantityUsed: number;
    createdAt: Date;
    updatedAt: Date;
};

export class SupplierFieiraStock {
    private constructor(
        private readonly props: SupplierFieiraStockProps,
        private readonly _id?: number,
    ) {}

    public static create(props: SupplierFieiraStockProps): SupplierFieiraStock {
        return new SupplierFieiraStock(props);
    }

    public static restore(
        props: SupplierFieiraStockProps,
        id: number,
    ): SupplierFieiraStock {
        return new SupplierFieiraStock(props, id);
    }

    public recalculateFromHistory(timeline: SupplierFieiraStockHistory[] | null): void {
        const history = timeline ?? [];

        const totalSent = history.reduce((total, item) => total + item.quantitySent, 0);

        this.props.quantitySent = totalSent;
        this.props.updatedAt = new Date();
    }

    public get id(): number | undefined {
        return this._id;
    }

    public get thickness(): number {
        return this.props.thickness;
    }

    public get width(): number {
        return this.props.width;
    }

    public get quantitySent(): number {
        return this.props.quantitySent;
    }

    public get quantityUsed(): number {
        return this.props.quantityUsed;
    }

    public get createdAt(): Date {
        return this.props.createdAt;
    }

    public get updatedAt(): Date {
        return this.props.updatedAt;
    }
}
