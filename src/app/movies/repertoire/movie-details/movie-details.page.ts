import {Component, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {Movie} from '../../movies.model';
import {ActivatedRoute, Router} from '@angular/router';
import {MoviesService} from '../../movies.service';
import {AlertController, LoadingController, ModalController, NavController, ToastController} from '@ionic/angular';
import {AuthService} from '../../../auth/auth.service';
import {UserReservationsService} from '../../user-reservations.service';
import {MovieModalComponent} from '../../movie-modal/movie-modal.component';
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.page.html',
  styleUrls: ['./movie-details.page.scss'],
})
export class MovieDetailsPage implements OnInit {
  movie: Movie;
  date: Date;
  currentDate: Date = new Date();
  isLoading = false;
  itemExpanded = false;
  itemExpandedHeight = 0;
  broj= 0;

  constructor(
    private route: ActivatedRoute,
    private moviesService: MoviesService,
    private router: Router,
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    public authService: AuthService,
    private userReservationsService: UserReservationsService,
    private toastCtrl: ToastController,
  ) {

  }
  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('movieId')) {
        this.navCtrl.navigateBack('/movies/tabs/repertoire');
        return;
      }

      this.isLoading = true;

      this.moviesService
        .getMovie(paramMap.get('movieId'))
        .subscribe((movie) => {
          this.movie= movie;
          this.isLoading = false;
        });
    });

  }

  expandItem() {
    this.itemExpanded = !this.itemExpanded;
    console.log(this.itemExpanded);
  }

  onDeleteMovie(){
    this.alertCtrl.create({header: 'Brisanje',
      message: 'Da li ste sigurni da želite da obrišete ovaj film?',
      buttons: [{
        text: 'Odustani',
        role: 'cancel'
      }, {
        text: 'Obriši',
        handler: () => {
          this.moviesService.deleteMovie(this.movie.id).subscribe(() => {
            this.navCtrl.navigateBack('/movies/tabs/repertoire');
          });
        }
      }]
    }).then(alertEl => {
      alertEl.present();
    });
  }

  onEditMovie() {
    this.modalCtrl
      .create({
        component: MovieModalComponent,
        componentProps: {
          name: this.movie.name,
          description: this.movie.description,
          date: this.movie.date,
          duration:this.movie.duration,
          seats: this.movie.seats,
          actors: this.movie.actors,
          imageUrl: this.movie.imageUrl},
      })
      .then((modal) => {
        modal.present();
        return modal.onDidDismiss();
      })
      .then((resultData) => {
        if (resultData.role === 'confirm') {
          this.loadingCtrl
            .create({message: 'Čuvanje...'})
            .then((loadingEl) => {
              loadingEl.present();
              this.moviesService
                .editMovie(
                  this.movie.id,
                  resultData.data.movieData.name,
                  resultData.data.movieData.description,
                  resultData.data.movieData.date,
                  resultData.data.movieData.duration,
                  resultData.data.movieData.seats,
                  resultData.data.movieData.actors,
                  resultData.data.movieData.imageUrl,
                )
                .subscribe((movies) => {
                  this.movie.name = resultData.data.movieData.name;
                  this.movie.description = resultData.data.movieData.description;
                  this.movie.date = resultData.data.movieData.date;
                  this.movie.duration=resultData.data.movieData.duration;
                  this.movie.seats = resultData.data.movieData.seats;
                  this.movie.actors = resultData.data.movieData.actors;
                  this.movie.imageUrl = resultData.data.movieData.imageUrl;
                  loadingEl.dismiss();
                });
            });
        }
      });
  }
  onEditMovieUser() {
              this.moviesService
                .editMovie(
                  this.movie.id,
                  this.movie.name,
                  this.movie.description,
                  this.movie.date,
                  this.movie.duration,
                  this.movie.seats,
                  this.movie.actors,
                  this.movie.imageUrl,
                )
                .subscribe((movies) => {
                  this.movie.name = this.movie.name;
                  this.movie.description = this.movie.description;
                  this.movie.date = this.movie.date;
                  this.movie.duration=this.movie.duration;
                  this.movie.seats = this.movie.seats;
                  this.movie.actors = this.movie.actors;
                  this.movie.imageUrl = this.movie.imageUrl;

                });
  }

  failedAlert(message: string) {
    this.alertCtrl.create({
      message,
      buttons: [{
        text: 'OK',
        handler: () => {
          this.onReserve();
        }
      }]

    }).then(alertEl => {
      alertEl.present();
    });
  }

  onReserve(){
    this.date = new Date(this.movie.date);
    console.log('date:' + this.date);
    console.log('current date: ' + this.currentDate);
    if(this.date < this.currentDate){
      this.toastMessage(`Nije moguće rezervisati karte. Premijera filma ${this.movie.name} je završena.`);
    }else{
        this.alertCtrl.create({
        header: 'Rezervacija',
        cssClass: 'my-custom-alert',
        message: 'Koliko karate želite da rezervišete?' +
          '(Možete izabrati najviše 6 ulaznica po narudžbini)'+
        `<img src="assets/icon/salaa.png" alt="g-maps" style="border-radius: 2px">`+
        'Broj slobodnih mesta:'+ this.movie.seats,
        inputs: [
          {
            name: 'numberOfTickets',
            type: 'number',
            placeholder: 'Broj karata',
          }
        ],

        buttons: [{
          text: 'Odustani',
          role: 'cancel'
        }, {
          text: 'Rezerviši',
          handler: (alertData) => {
            if(alertData.numberOfTickets === '' || alertData.numberOfTickets <= 0 || alertData.numberOfTickets>6) {
              this.failedAlert('Morate da unesete ispravan broj karata');
            } else {
              if(alertData.numberOfTickets>this.movie.seats){
                this.failedAlert('Nažalost nema više slobodnih mesta');
              }

              this.movie.seats=this.movie.seats-alertData.numberOfTickets;

              this.userReservationsService.reserveTickets(this.movie, alertData.numberOfTickets).subscribe(() => {
                this.onEditMovieUser();
                this.navCtrl.navigateBack('/movies/tabs/reservations');
                //console.log(this.global.popunjenostSale);
                console.log(this.broj);
                //console.log(this.movie.seats);
                console.log(this.movie.seats);
                //console.log(this.global.kapacitetSale);
                this.toastMessage(`Uspešno ste rezervisali karte za premijeru filma ${this.movie.name}. \n Možete ih preuzeti najkasnije pola sata pre početka premijere!`);
              });
            }
          }
        }]
      }).then(alertEl => {
        alertEl.present();
      });
    }}

  async toastMessage(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 5000,
    });
    toast.present();
  }

}

