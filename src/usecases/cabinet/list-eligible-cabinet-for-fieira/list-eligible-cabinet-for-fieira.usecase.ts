import type {
    CabinetGateway,
    EligibleCabinet,
} from "../../../domain/cabinet/gateway/cabinet.gateway.js";
import type { Usecase } from "../../usecase.js";

export type ListEligibleCabinetForFieiraInputDto = void;

export type ListEligibleCabinetForFieiraOutputDto = {
    eligibleCabinets: {
        cabinetName: string;
        dimension: string;
        tension: number;
        qtdFieiraStock: number;
        lastModification: Date;
    }[];
};

export class ListEligibleCabinetForFieiraUseCase implements Usecase<
    ListEligibleCabinetForFieiraInputDto,
    ListEligibleCabinetForFieiraOutputDto
> {
    private constructor(private readonly cabinetGateway: CabinetGateway) {}

    public static create(cabinetGateway: CabinetGateway) {
        return new ListEligibleCabinetForFieiraUseCase(cabinetGateway);
    }

    private sortEligibleCabinets(cabinets: EligibleCabinet[]): EligibleCabinet[] {
        return [...cabinets].sort((a, b) => {
            if (a.allFieirasDead !== b.allFieirasDead) {
                return a.allFieirasDead ? -1 : 1;
            }
            const dateA = a.lastModification?.getTime() ?? 0;
            const dateB = b.lastModification?.getTime() ?? 0;

            return dateA - dateB;
        });
    }

    private filterEligibleCabinets(cabinets: EligibleCabinet[]): EligibleCabinet[] {
        return cabinets.filter((cabinet) => cabinet.cabinetName.startsWith("CTC"));
    }

    public async execute(): Promise<ListEligibleCabinetForFieiraOutputDto> {
        const cabinetEligible = await this.cabinetGateway.listEligibleForFieira();

        const ctcCabinets = this.filterEligibleCabinets(cabinetEligible);

        const sortedCabinets = this.sortEligibleCabinets(ctcCabinets);

        const output = this.presentOutput(sortedCabinets);

        return output;
    }

    private presentOutput(
        cabinets: EligibleCabinet[],
    ): ListEligibleCabinetForFieiraOutputDto {
        return {
            eligibleCabinets: cabinets.map((cabinet) => ({
                cabinetName: cabinet.cabinetName,
                dimension: `${cabinet.width}x${cabinet.thickness}`,
                tension: cabinet.tension,
                qtdFieiraStock: cabinet.qtdFieiraStock,
                lastModification: cabinet.lastModification,
            })),
        };
    }
}
