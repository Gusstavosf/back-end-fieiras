export type RequistionItem = {
    requisitionId: number;
    stockFieiraId: number;
    supplierFieiraStockId: number | null;
    type: RequisitionItemType;
    createdAt: Date;
};

export enum RequisitionItemType {
    new = "new",
    rework = "rework",
}

export class RequisitionItem {
    private constructor(
        private readonly props: RequistionItem,
        private readonly _id?: number,
    ) {}

    public static create(props: RequistionItem): RequisitionItem {
        return new RequisitionItem(props);
    }

    public static restore(props: RequistionItem, id: number): RequisitionItem {
        return new RequisitionItem(props, id);
    }

    public get id(): number | undefined {
        return this._id;
    }

    public get requisitionId(): number {
        return this.props.requisitionId;
    }

    public get stockFieiraId(): number {
        return this.props.stockFieiraId;
    }

    public get supplierFieiraStockId(): number | null {
        return this.props.supplierFieiraStockId;
    }

    public get type(): RequisitionItemType {
        return this.props.type;
    }

    public get createdAt(): Date {
        return this.props.createdAt;
    }
}
