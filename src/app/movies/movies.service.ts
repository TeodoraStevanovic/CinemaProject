import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Movie} from './movies.model';
import {HttpClient} from '@angular/common/http';
import {AuthService} from '../auth/auth.service';
import {map, switchMap, take, tap} from 'rxjs/operators';
export interface MovieData {
  name: string;
  description: string;
  date: Date;
  duration: string;
  seats: number;
  actors: string;
  imageUrl: string;
}
@Injectable({
  providedIn: 'root'
})

export class MoviesService {
  _movies = new BehaviorSubject<Movie[]>([]);
  constructor(public http: HttpClient, public authService: AuthService) {
  }

  get movies() {
    return this._movies.asObservable();
  }

  addMovie(name: string, description: string, date: Date, duration: string, seats: number, actors: string, imageUrl: string) {
    let generatedId;
    let newMovie: Movie;

    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        newMovie = new Movie(
          null,
          name,
          description,
          date,
          duration,
          seats,
          actors,
          imageUrl
        );
        return this.http.post<{ name: string }>(
          `https://cinema-moviestar-default-rtdb.europe-west1.firebasedatabase.app/movies.json?auth=${token}`, newMovie);
      }),
      take(1),
      switchMap((resData) => {
        generatedId = resData.name;
        return this._movies;
      }),
      take(1),
      tap((movies) => {
        newMovie.id = generatedId;
        this._movies.next(movies.concat(newMovie));
      })
    );
  }

  getMovies() {
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => this.http.get<{ [key: string]: MovieData }>(
          `https://cinema-moviestar-default-rtdb.europe-west1.firebasedatabase.app/movies.json?auth=${token}`
        )),
      map((movieData: any) => {
        const movies: Movie[] = [];

        for (const key in movieData) {
          if (movieData.hasOwnProperty(key)) {
            movies.push(new Movie(key, movieData[key].name, movieData[key].description, movieData[key].date, movieData[key].duration, movieData[key].seats, movieData[key].actors, movieData[key].imageUrl)
            );
          }
        }
        return movies.sort((a, b) => a.date <= b.date ? -1 : 1);
      }),
      tap(movies => {
        this._movies.next(movies);
      }));
  }


  getMovie(id: string) {
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => this.http.get<MovieData>(
          `https://cinema-moviestar-default-rtdb.europe-west1.firebasedatabase.app/movies/${id}.json?auth=${token}`
        )),
      map((resData: MovieData) => new Movie(
          id,
          resData.name,
          resData.description,
          resData.date,
          resData.duration,
          resData.seats,
          resData.actors,
          resData.imageUrl
        )));
  }


  deleteMovie(id: string) {
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => this.http.delete(
          `https://cinema-moviestar-default-rtdb.europe-west1.firebasedatabase.app/movies/${id}.json?auth=${token}`
        )),
      // eslint-disable-next-line no-underscore-dangle
      switchMap(() => this._movies),
      take(1),
      tap((movies) => {
        this._movies.next(movies.filter((p) => p.id !== id));
      })
    );
  }

  editMovie(
    id: string,
    name: string,
    description: string,
    date: Date,
    duration: string,
    seats: number,
    actors: string,
    imageUrl: string
  ) {
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => this.http.put(
          `https://cinema-moviestar-default-rtdb.europe-west1.firebasedatabase.app/movies/${id}.json?auth=${token}`,
          {
            name,
            description,
            date,
            duration,
            seats,
            actors,
            imageUrl,
          }
        )), switchMap(() => this._movies),
      take(1),
      tap((movies) => {
        const updatedPerfIndex = movies.findIndex((p) => p.id === id);
        const updatedMovies = [...movies];
        updatedMovies[updatedPerfIndex] = new Movie(
          id,
          name,
          description,
          date,
          duration,
          seats,
          actors,
          imageUrl
        );
        this._movies.next(updatedMovies);
      })
    );
  }

}
