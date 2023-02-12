import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserReservation} from '../userReservation.model';
import {User} from '../../auth/user.model';
import {Subscription} from 'rxjs';
import {UserReservationsService} from '../user-reservations.service';
import {MoviesService} from '../movies.service';
import {AuthService} from '../../auth/auth.service';
import {Movie} from "../movies.model";

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.page.html',
  styleUrls: ['./reservations.page.scss'],
})
export class ReservationsPage implements OnInit, OnDestroy {

  userReservations: UserReservation[];
  movie: Movie;
  user: User;
  private sub: Subscription;

  constructor(private userReservationsService: UserReservationsService,
              private moviesService: MoviesService,
              private authService: AuthService) {
    this.user = authService.currentUser;
  }

  ngOnInit() {
    this.sub = this.userReservationsService.userReservations.subscribe(userReservations => {
      this.userReservations = userReservations;
    });
  }

  ionViewWillEnter() {
    this.userReservationsService.getReservations(this.user.email).subscribe(userReservations => {
    });
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
