export type SupplierFieiraStockHistoryProps = {
    id: number;
    supplierFieiraStockId: number;
    quantitySent: number;
    createdAt: Date;
    updatedAt: Date;
};

export class SupplierFieiraStockHistory {
    private constructor(private readonly props: SupplierFieiraStockHistoryProps) {}

    public static restore(
        props: SupplierFieiraStockHistoryProps,
    ): SupplierFieiraStockHistory {
        return new SupplierFieiraStockHistory(props);
    }

    public updateQuantitySent(quantitySent: number): void {
        this.props.quantitySent = quantitySent;
        this.props.updatedAt = new Date();
    }

    public get id(): number {
        return this.props.id;
    }

    public get supplierFieiraStockId(): number {
        return this.props.supplierFieiraStockId;
    }

    public get quantitySent(): number {
        return this.props.quantitySent;
    }

    public get createdAt(): Date {
        return this.props.createdAt;
    }

    public get updatedAt(): Date {
        return this.props.updatedAt;
    }
}
