import { Component, OnInit } from '@angular/core';
import {UserReservation} from '../movies/userReservation.model';
import {Subscription} from 'rxjs';
import {UserReservationsService} from '../movies/user-reservations.service';

@Component({
  selector: 'app-admin-reservations',
  templateUrl: './admin-reservations.page.html',
  styleUrls: ['./admin-reservations.page.scss'],
})
export class AdminReservationsPage implements OnInit {
  allReservations: UserReservation[];
  private reservationSub: Subscription;

  constructor(private userReservationsService: UserReservationsService) { }

  ngOnInit() {
    this.reservationSub = this.userReservationsService.allReservations.subscribe(allReservations => {
      this.allReservations = allReservations;
    });
  }

  ionViewWillEnter() {
    this.userReservationsService.getAllReservations().subscribe(allReservations => {
    });
  }

  // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
  ngOnDestroy() {
    if (this.reservationSub) {
      this.reservationSub.unsubscribe();
    }
  }

}
