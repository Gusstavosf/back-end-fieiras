export type ControlFieiraProps = {
    fieiraId: number | null;
    order: number;
    material: number;
    orderQuantity: number;
    wireType: string;
    metal: Metal;
    tension: number;
    width: number;
    thickness: number;
    fieiraWidth: number;
    fieiraThickness: number;
    orderStartDate: Date;
    orderEndDate: Date;
    orderCreateDate: Date;
    qtdFieiraNec: number;
    status: ControlStatus;
    createdAt: Date;
    updatedAt: Date;
};

export enum Metal {
    Cu = "cu",
    Al = "al",
}

export type Tension = 60 | 90 | 120 | 140 | 170 | 220;

export enum ControlStatus {
    Open = "open",
    ReleasedPrinted = "released_printed",
    ReleasedNotPrinted = "released_not_printed",
    Completed = "completed",
    Canceled = "canceled",
}

export class ControlFieira {
    private constructor(
        private readonly props: ControlFieiraProps,
        private readonly _id?: number | undefined,
    ) {}

    public static create(props: ControlFieiraProps) {
        return new ControlFieira(props);
    }

    public static restore(props: ControlFieiraProps, id: number) {
        return new ControlFieira(props, id);
    }

    public get id(): number | undefined {
        return this._id;
    }

    public get fieiraId(): number | null {
        return this.props.fieiraId;
    }

    public get material(): number {
        return this.props.material;
    }

    public get order(): number {
        return this.props.order;
    }

    public get wireType(): string {
        return this.props.wireType;
    }

    public get metal(): Metal {
        return this.props.metal as Metal;
    }

    public get tension(): Tension {
        return this.props.tension as Tension;
    }

    public get width(): number {
        return this.props.width;
    }

    public get thickness(): number {
        return this.props.thickness;
    }

    public get fieiraWidth(): number {
        return this.props.fieiraWidth;
    }

    public get fieiraThickness(): number {
        return this.props.fieiraThickness;
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

    public get orderCreateDate(): Date {
        return this.props.orderCreateDate;
    }

    public get status(): ControlStatus {
        return this.props.status;
    }
    public get qtdFieiraNec(): number {
        return this.props.qtdFieiraNec;
    }

    public get createdAt(): Date {
        return this.props.createdAt;
    }

    public get updatedAt(): Date {
        return this.props.updatedAt;
    }
}
