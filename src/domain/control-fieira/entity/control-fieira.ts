export type ControlFieiraProps = {
    id: number;
    fieiraId: number;
    order: number;
    orderQuantity: number;
    wireType: string;
    metal: Metal;
    tension: number;
    width: number;
    thickness: number;
    orderStartDate: Date;
    orderEndDate: Date;
    orderCreateDate: Date;
    status: ControlStatus;
    createdAt: Date;
    updatedAt: Date;
};

export enum Metal {
    Cu = "cu",
    Al = "al",
}

export enum ControlStatus {
    Open = "open",
    ReleasedPrinted = "released_printed",
    ReleasedNotPrinted = "released_not_printed",
    Completed = "completed",
    Canceled = "canceled",
}

export class ControlFieira {
    private constructor(private readonly props: ControlFieiraProps) {}

    public static create(props: ControlFieiraProps) {
        return new ControlFieira({
            ...props,
        });
    }

    public static restore(props: ControlFieiraProps) {
        return new ControlFieira(props);
    }

    public get id(): number {
        return this.props.id;
    }

    public get fieiraId(): number {
        return this.props.fieiraId;
    }

    public get order(): number {
        return this.props.order;
    }

    public get wireType(): string {
        return this.props.wireType;
    }

    public get material(): Metal {
        return this.props.metal;
    }

    public get tension(): number {
        return this.props.tension;
    }

    public get width(): number {
        return this.props.width;
    }

    public get thickness(): number {
        return this.props.thickness;
    }

    public get orderStartDate(): Date {
        return this.props.orderStartDate;
    }

    public get orderEndDate(): Date {
        return this.props.orderEndDate;
    }

    public get orderQuantity(): number {
        return this.props.orderQuantity;
    }

    public get status(): ControlStatus {
        return this.props.status;
    }

    public get createdAt(): Date {
        return this.props.createdAt;
    }

    public get updatedAt(): Date {
        return this.props.updatedAt;
    }
}
