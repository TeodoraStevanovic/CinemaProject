import {Component, Injectable, OnDestroy, OnInit} from '@angular/core';
import {Movie} from '../movies.model';
import {Subscription} from 'rxjs';
import {MoviesService,MovieData} from '../movies.service';
import {FormControl} from "@angular/forms";
import {HttpClient} from '@angular/common/http';
import {AuthService} from  "src/app/auth/auth.service";
import {map, switchMap, take, tap} from "rxjs/operators";

@Component({
  selector: 'app-repertoire',
  templateUrl: './repertoire.page.html',
  styleUrls: ['./repertoire.page.scss'],
})
@Injectable({
  providedIn: 'root'
})
export class RepertoirePage implements OnInit, OnDestroy{

  searchTerm: string;
  movies: Movie[];
  private movieSub: Subscription;
  public searchField: FormControl;
  descending: boolean = false;
  order: number;
  column: string = 'name';
  constructor(private moviesService: MoviesService, public http: HttpClient, public authService: AuthService) {
    this.searchField = new FormControl('');
  }

  ngOnInit() {
    this.movieSub = this.moviesService.movies.subscribe(movies => {
      this.movies=movies;
    }
    );

  }

  ionViewWillEnter() {
    this.moviesService.getMovies().subscribe(movies => {
    });
  }

  ngOnDestroy() {
    if (this.movieSub) {
      this.movieSub.unsubscribe();
    }
  }

  getSortedMoviesByDate() {
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => this.http.get<{ [key: string]: MovieData }>(
        `https://cinema-moviestar-default-rtdb.europe-west1.firebasedatabase.app/movies.json?auth=${token}`
      )),
      map((movieData: any) => {
        //const movies: Movie[] = [];

        for (const key in movieData) {
          if (movieData.hasOwnProperty(key)) {
            this.movies.push(new Movie(key, movieData[key].name, movieData[key].description, movieData[key].date, movieData[key].duration, movieData[key].seats, movieData[key].actors, movieData[key].imageUrl)
            );
          }
        }
        return this.movies.sort((a, b) => a.date <= b.date ? -1 : 1);
      }),
      tap(movies => {
        this.moviesService._movies.next(movies);
      }));
  }

}
