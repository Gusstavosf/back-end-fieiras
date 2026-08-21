export type ReservationFieiraProps = {
    controlFieiraId: number;
    stockFieiraId: number;
    quantity: number;
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

    public get id(): number | undefined {
        return this._id;
    }

    public get controlFieiraId(): number {
        return this.props.controlFieiraId;
    }

    public get stockFieiraId(): number {
        return this.props.stockFieiraId;
    }

    public get quantity(): number {
        return this.props.quantity;
    }

    public get createdAt(): Date {
        return this.props.createdAt;
    }

    public get updatedAt(): Date {
        return this.props.updatedAt;
    }
}
