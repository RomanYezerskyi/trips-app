export interface AdminStatisticsModel {
    usersStatisticsCount: string[];
    usersDateTime: Array<Date>;

    carsStatisticsCount: string[];
    carsDateTime: Array<Date>;

    tripsStatisticsCount: string[];
    tripsDateTime: Array<Date>;

    weekStatisticsTripsCount: string[];
    weekTripsDateTime: Array<string>;
}
