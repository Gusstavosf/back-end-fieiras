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

    public static create(props: SupplierFieiraStock): SupplierFieiraStock {
        return new SupplierFieiraStock(props);
    }

    public static restore(
        props: SupplierFieiraStockProps,
        id: number,
    ): SupplierFieiraStock {
        return new SupplierFieiraStock(props, id);
    }

    public get id(): number | undefined {
        return this._id;
    }

    public get thickness(): number {
        return this.thickness;
    }

    public get width(): number {
        return this.width;
    }

    public get quantitySent(): number {
        return this.quantitySent;
    }

    public get quantityUsed(): number {
        return this.quantityUsed;
    }

    public get createdAt(): Date {
        return this.createdAt;
    }

    public get updatedAt(): Date {
        return this.updatedAt;
    }
}
