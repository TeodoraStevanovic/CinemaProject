export class Movie {

  constructor(
    public id: string,
    public name: string,
    public description: string,
    public date: Date,
    public duration: string,
    public seats: number,
    public actors: string,
    public imageUrl: string) {}

   public get getSeats1() {
    return this.seats;
  }


   public setSeats2(seats: number) {
    this.seats=seats;
  }
}
