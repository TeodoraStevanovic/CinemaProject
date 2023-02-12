/* eslint-disable @typescript-eslint/quotes */
import { Movie } from "./movies.model";

export class UserReservation {

  constructor(
    public id: string,
    public userId: string,
    public movie: Movie,
    public numberOfTickets: number) {}

}
