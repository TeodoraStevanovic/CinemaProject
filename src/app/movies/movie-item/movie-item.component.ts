import {Component, Input, OnInit} from '@angular/core';
import {MoviesService} from '../movies.service';
import {AlertController, NavController} from '@ionic/angular';
import {AuthService} from '../../auth/auth.service';
import {Movie} from '../movies.model';

@Component({
  selector: 'app-movie-item',
  templateUrl: './movie-item.component.html',
  styleUrls: ['./movie-item.component.scss'],
})
export class MovieItemComponent implements OnInit {
  @Input() movieItem: Movie;
  constructor(private movieService: MoviesService, private alertCtrl: AlertController,
              private navCtrl: NavController, public authService: AuthService) { }

  ngOnInit() {}
  onDeleteMovie(movie: Movie){
    this.alertCtrl.create({header: 'Brisanje',
      message: 'Da li ste sigurni da želite da obrišete ovaj film?',
      buttons: [{
        text: 'Odustani',
        role: 'cancel'
      }, {
        text: 'Obriši',
        handler: () => {
          this.movieService.deleteMovie(movie.id).subscribe(() => {
            this.navCtrl.navigateBack('/movies/tabs/repertoire');
          });
        }
      }]
    }).then(alertEl => {
      alertEl.present();
    });
  }
}
