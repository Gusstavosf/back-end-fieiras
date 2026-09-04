import IncorrectRequest from "../../../core/shared/errors/incorrectRequest.js";

export type ControlFieiraProps = {
    fieiraId: number | null;
    order: number;
    material: number;
    orderQuantity: number;
    wireType: string;
    metal: Metal;
    tension: Tension;
    width: number;
    thickness: number;
    orderStartDate: Date;
    orderEndDate: Date;
    orderCreateDate: Date;
    qtdFieiraNec: number;
    status: ControlStatus;
    createdAt: Date;
    updatedAt: Date;
};

export type UpdateControlFieiraProps = {
    fieiraId: number | null;
    orderQuantity: number;
    wireType: string;
    metal: Metal;
    tension: Tension;
    width: number;
    thickness: number;
    orderStartDate: Date;
    orderEndDate: Date;
    orderCreateDate: Date;
    status: ControlStatus;
    qtdFieiraNec: number;
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
        private readonly _id?: number,
    ) {}

    public static create(props: ControlFieiraProps) {
        return new ControlFieira(props);
    }

    public static restore(props: ControlFieiraProps, id: number) {
        return new ControlFieira(props, id);
    }

    private hasChanges(props: UpdateControlFieiraProps): boolean {
        return (
            this.props.fieiraId !== props.fieiraId ||
            this.props.orderQuantity !== props.orderQuantity ||
            this.props.wireType !== props.wireType ||
            this.props.metal !== props.metal ||
            this.props.tension !== props.tension ||
            this.props.width !== props.width ||
            this.props.thickness !== props.thickness ||
            this.props.orderStartDate.getTime() !== props.orderStartDate.getTime() ||
            this.props.orderEndDate.getTime() !== props.orderEndDate.getTime() ||
            this.props.orderCreateDate.getTime() !== props.orderCreateDate.getTime() ||
            this.props.status !== props.status ||
            this.props.qtdFieiraNec !== props.qtdFieiraNec
        );
    }

    public update(props: UpdateControlFieiraProps): boolean {
        if (!this.hasChanges(props)) {
            return false;
        }

        this.props.fieiraId = props.fieiraId;
        this.props.orderQuantity = props.orderQuantity;
        this.props.wireType = props.wireType;
        this.props.metal = props.metal;
        this.props.tension = props.tension;
        this.props.width = props.width;
        this.props.thickness = props.thickness;
        this.props.orderStartDate = props.orderStartDate;
        this.props.orderEndDate = props.orderEndDate;
        this.props.orderCreateDate = props.orderCreateDate;
        this.props.status = props.status;
        this.props.qtdFieiraNec = props.qtdFieiraNec;
        this.props.updatedAt = new Date();

        return true;
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
        return this.props.metal;
    }

    public get tension(): Tension {
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
