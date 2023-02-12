import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {ModalController} from '@ionic/angular';
import {MoviesService} from '../movies.service';

@Component({
  selector: 'app-movie-modal',
  templateUrl: './movie-modal.component.html',
  styleUrls: ['./movie-modal.component.scss'],
})
export class MovieModalComponent implements OnInit {
  @Input() name: string;
  @Input() description: string;
  @Input() duration: string;
  @Input() date: Date;
  @Input() seats: number;
  @Input() actors: string;
  @Input() imageUrl: string;
  @ViewChild('editMovie', {static: true}) editMovie: NgForm;

  constructor(private modalCtrl: ModalController, private moviesService: MoviesService) {
  }

  ngOnInit() {
  }

  onCancel() {
    this.modalCtrl.dismiss();
  }

  onEditMovie() {
    if (!this.editMovie.valid) {
      return;
    }

    this.modalCtrl.dismiss(
      {
        movieData: {
          name: this.editMovie.value.name,
          description: this.editMovie.value.description,
          duration: this.editMovie.value.duration,
          date: this.editMovie.value.date,
          seats: this.editMovie.value.seats,
          actors: this.editMovie.value.actors,
          imageUrl: this.editMovie.value.imageUrl,
        }
      },
      'confirm'
    );
  }
}
