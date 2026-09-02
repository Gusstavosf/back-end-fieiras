export type ReservationFieiraProps = {
    controlFieiraId: number;
    stockFieiraId: number | null;
    quantity: number | null;
    createdAt: Date;
    updatedAt: Date;
};

export class ReservationFieira {
    private constructor(
        private readonly props: ReservationFieiraProps,
        private readonly _id?: number,
    ) {}

    public static create(props: ReservationFieiraProps): ReservationFieira {
        return new ReservationFieira(props);
    }

    public static restore(props: ReservationFieiraProps, id: number): ReservationFieira {
        return new ReservationFieira(props, id);
    }

    public attachStockFieira(stockFieiraId: number, quantity: number): void {
        this.props.stockFieiraId = stockFieiraId;
        this.props.quantity = quantity;
        this.props.updatedAt = new Date();
    }

    public get id(): number | undefined {
        return this._id;
    }

    public get controlFieiraId(): number {
        return this.props.controlFieiraId;
    }

    public get stockFieiraId(): number | null {
        return this.props.stockFieiraId ?? null;
    }

    public get quantity(): number | null {
        return this.props.quantity ?? null;
    }

    public get createdAt(): Date {
        return this.props.createdAt;
    }

    public get updatedAt(): Date {
        return this.props.updatedAt;
    }
}
