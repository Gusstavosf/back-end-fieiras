export type FieiraProps = {
    id: number;
    cabinetId: number | null;
    width: number;
    thickness: number;
    nominalFieiraCapacity: number;
    createdAt: Date;
    updatedAt: Date;
};

export class Fieira {
    private constructor(private readonly props: FieiraProps) {}

    public static create(cabinetId: number, width: number, thickness: number) {
        return new Fieira({
            id: 0,
            cabinetId,
            width,
            thickness,
            nominalFieiraCapacity: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    }

    public static restore(props: FieiraProps) {
        return new Fieira(props);
    }

    public get id(): number {
        return this.props.id;
    }

    public get cabinetId(): number | null {
        return this.props.cabinetId;
    }

    public get width(): number {
        return this.props.width;
    }

    public get thickness(): number {
        return this.props.thickness;
    }

    public get nominalFieiraCapacity(): number {
        return this.props.nominalFieiraCapacity;
    }

    public get createdAt(): Date {
        return this.props.createdAt;
    }

    public get updatedAt(): Date {
        return this.props.updatedAt;
    }
}
