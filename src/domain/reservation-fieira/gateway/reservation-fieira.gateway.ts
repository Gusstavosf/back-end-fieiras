import { ReservationFieira } from "../entity/reservation-fieira.js";

export interface ReservationFieiraGateway {
    save(reservation: ReservationFieira): Promise<ReservationFieira>;
    update(reservation: ReservationFieira): Promise<ReservationFieira>;
    findByControlFieira(controlId: number): Promise<ReservationFieira[]>;
    findByStockFieira(stockFieiraId: number): Promise<ReservationFieira[]>;
}
