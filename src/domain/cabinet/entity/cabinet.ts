export type CabinetProps = {
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
};

export class Cabinet {
    private constructor(private readonly props: CabinetProps) {}

    public static create(name: string) {
        return new Cabinet({
            id: 0,
            name,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    }

    public static restore(props: CabinetProps) {
        return new Cabinet(props);
    }

    public get id(): number {
        return this.props.id;
    }

    public get name(): string {
        return this.props.name;
    }

    public get createdAt(): Date {
        return this.props.createdAt;
    }

    public get updatedAt(): Date {
        return this.props.updatedAt;
    }
}
