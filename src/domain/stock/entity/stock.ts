import IncorrectRequest from "../../../core/shared/errors/incorrectRequest.js";

export enum StatusFieira {
    New = "Nova",
    Requested = "Requisição",
    Dead = "Morta",
    Polished = "Polida"
}

export type StockProps = {
    id?: number;
    cabinetId: number;
    code: string;
    status: StatusFieira;
    currentThickness?: number;
    currentWidth?: number;
    utilization?: number;
    production?: number;
    createdAt: Date;
    updatedAt: Date;   
}

export class Stock {

    private constructor(private readonly props: StockProps){}

    public static create(cabinetId: number, code: string, status: StatusFieira) {
        return new Stock({
            cabinetId,
            code,
            status,
            utilization: 0,
            production: 0,
            createdAt: new Date(),
            updatedAt: new Date()
        });
    }

    public static restore(props: StockProps){
        return new Stock(props);
    }

    public updateStatus(newStatus: StatusFieira): void {
        if (this.props.status === StatusFieira.Dead && newStatus !== StatusFieira.Dead){
            throw new IncorrectRequest(`A fieira "${this.props.code}" está morta e o seu status não pode ser alterado para "${newStatus}".`);
        }

        if (this.props.status === newStatus){
            return;
        }

        this.props.status = newStatus;
        this.props.updatedAt = new Date();
    }

    public registerUse(data: { thickness: number, width: number, additionalProduction: number }): void {
        if (this.props.status === StatusFieira.Dead){
            throw new IncorrectRequest("Não é possível atualizar os dados de uma fieira que já está morta.");
        }

        if (this.props.currentThickness && data.thickness < this.props.currentThickness){
            throw new IncorrectRequest(
                `A nova espessura (${data.thickness}) não pode ser menor que a espessura atual (${this.props.currentThickness}).`
            );
        }

        if (this.props.currentWidth && data.width < this.props.currentWidth){
            throw new IncorrectRequest(
                `A nova largura (${data.width}) não pode ser menor que a largura atual (${this.props.currentWidth}).`
            );
        }

        if (data.additionalProduction < 0){
            throw new IncorrectRequest("A produção adicional não pode ser um valor negativo.");
        }

        this.props.currentThickness = data.thickness;
        this.props.currentWidth = data.width;

        this.props.production = (this.props.production ?? 0) + data.additionalProduction;
        this.props.utilization = (this.props.utilization ?? 0) + 1;

        this.props.updatedAt = new Date();
    }

    public get id(): number | undefined { return this.props.id }
    public get cabinetId(): number { return this.props.cabinetId }
    public get code(): string { return this.props.code }
    public get status(): StatusFieira { return this.props.status }
    public get createdAt(): Date { return this.props.createdAt }
    public get updatedAt(): Date { return this.props.updatedAt }

    public get currentThickness(): number | undefined { return this.props.currentThickness }
    public get currentWidth(): number | undefined { return this.props.currentWidth }
    public get utilization(): number | undefined { return this.props.utilization }
    public get production(): number | undefined { return this.props.production }
}