export type ControlFieiraProps = {
    id: number;
    fieiraId: number;
    order: number;
    wireType: string;
    tension: number;
    width: number;
    thickness: number;
    orderStartDate: Date;
    orderEndDate: Date;
    orderQuantity: number;
    createdAt: Date;
    updatedAt: Date;
};

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

    public get createdAt(): Date {
        return this.props.createdAt;
    }

    public get updatedAt(): Date {
        return this.props.updatedAt;
    }
}
