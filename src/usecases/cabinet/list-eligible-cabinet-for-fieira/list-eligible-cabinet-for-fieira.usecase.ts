import type {
    CabinetGateway,
    EligibleCabinet,
} from "../../../domain/cabinet/gateway/cabinet.gateway.js";
import type { Usecase } from "../../usecase.js";

export type ListEligibleCabinetForFieiraInputDto = void;

export type ListEligibleCabinetForFieiraOutputDto = {
    eligibleCabinets: {
        cabinetName: string;
        dimension: string | null;
        tension: number | null;
        qtdFieiraStock: number;
        lastModification: Date | null;
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
            if (a.hasFieira !== b.hasFieira) {
                return a.hasFieira ? 1 : -1;
            }

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
        const emptyCabinets = await this.cabinetGateway.listCabinetsEmpty();

        const cabinets = [...cabinetEligible, ...emptyCabinets];

        const ctcCabinets = this.filterEligibleCabinets(cabinets);

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
                dimension:
                    cabinet.width !== null && cabinet.thickness !== null
                        ? `${cabinet.width}x${cabinet.thickness}`
                        : null,
                tension: cabinet.tension,
                qtdFieiraStock: cabinet.qtdFieiraStock,
                lastModification: cabinet.lastModification,
            })),
        };
    }
}
