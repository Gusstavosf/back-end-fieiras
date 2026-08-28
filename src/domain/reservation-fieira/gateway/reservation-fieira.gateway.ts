import { ReservationFieira } from "../entity/reservation-fieira.js";

export interface ReservationFieiraGateway {
    save(reservation: ReservationFieira): Promise<ReservationFieira>;
    findByControlFieira(controlFieiraId: number): Promise<ReservationFieira[]>;
    findByStockFieira(stockFieiraId: number): Promise<ReservationFieira[]>;
    delete(controlFieiraId: number, stockFieiraId: number): Promise<void>;
    indByControlFieira(controlFieiraId: number): Promise<ReservationFieira[]>;
}
