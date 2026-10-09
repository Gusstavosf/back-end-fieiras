export type RequisitionProps = {
    fieiraId: number;
    currentStockQty: number;
    type: RequisitionType;
    necessaryQty: number;
    currentStockCapacity: number;
    createdAt: Date;
    updatedAt: Date;
};

export enum RequisitionType {
    production = "production",
    free_stock = "free_stock",
}

export class Requisition {
    private constructor(
        private readonly props: RequisitionProps,
        private readonly _id?: number,
    ) {}

    public static create(props: RequisitionProps): Requisition {
        return new Requisition(props);
    }

    public static restore(props: RequisitionProps, id: number): Requisition {
        return new Requisition(props, id);
    }

    public get id(): number | undefined {
        return this._id;
    }

    public get fieiraId(): number {
        return this.props.fieiraId;
    }

    public get type(): RequisitionType {
        return this.props.type;
    }

    public get currentStockQty(): number {
        return this.props.currentStockQty;
    }

    public get currentStockCapacity(): number {
        return this.props.currentStockCapacity;
    }

    public get necessaryQty(): number {
        return this.props.necessaryQty;
    }

    public get createdAt(): Date {
        return this.props.createdAt;
    }

    public get updatedAt(): Date {
        return this.props.updatedAt;
    }
}
