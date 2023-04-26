export interface SeatModel {
    id: number;
    seatNumber: number;
    carId: number;
    tripUsers: any[]
    isSelected?: boolean
}
