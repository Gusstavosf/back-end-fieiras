import { ControlStatus } from "../entity/control-fieira.js";

export class StatusParser {
    parse(status: string): ControlStatus | null {
        const normalizedStatus = status.trim().toUpperCase();

        if (normalizedStatus.includes("MREL")) return ControlStatus.Canceled;

        if (normalizedStatus.includes("MOME")) return ControlStatus.Completed;

        if (normalizedStatus.includes("LIB")) {
            if (normalizedStatus.includes("IMPR")) {
                return ControlStatus.ReleasedPrinted;
            }
            return ControlStatus.ReleasedNotPrinted;
        }
        if (normalizedStatus.includes("ABER")) return ControlStatus.Open;

        return null;
    }
}
