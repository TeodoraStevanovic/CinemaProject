import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../auth/auth.service';
import {LoadingController} from '@ionic/angular';
import {Router} from '@angular/router';
import {MoviesService} from '../movies.service';

@Component({
  selector: 'app-add-new',
  templateUrl: './add-new.page.html',
  styleUrls: ['./add-new.page.scss'],
})
export class AddNewPage implements OnInit {


  validationMessage = {
    name: [
      {type: 'required', message:'Unesite naziv filma'},
    ],
    description: [
      {type: 'required', message:'Unesite kratak opis radnje'},
    ],
    date: [
      {type: 'required', message:'Izaberite datum prikazivanja filma'},
    ],
    duration: [
      {type: 'required', message:'Unesite vreme trajanja filma'},
    ],
    seats: [
      {type: 'required', message:'Unesite broj dostupnih sedišta'},
    ],
    actors: [
      {type: 'required', message:'Unesite imena glavnih glumaca'},
    ],
    imageUrl: [
      {type: 'required', message:'Unesite URL adresu slike predstave'},
    ],
  };

  addMovie: FormGroup;

  constructor(public formBuilder: FormBuilder,
              private authService: AuthService,
              private loadingCtl: LoadingController,
              private router: Router,
              private moviesService: MoviesService,
  ) { }


  ngOnInit() {
    this.addMovie = this.formBuilder.group({
      name: new FormControl('', Validators.compose([
        Validators.required
      ])),
      description: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      date: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      duration: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      seats: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      actors: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      imageUrl: new FormControl('', Validators.compose([
        Validators.required,
      ])),
    });
  }

  onAddMovie() {
    this.moviesService.addMovie(
      this.addMovie.value.name,
      this.addMovie.value.description,
      this.addMovie.value.date,
      this.addMovie.value.duration,
      this.addMovie.value.seats,
      this.addMovie.value.actors,
      this.addMovie.value.imageUrl).subscribe(movies => {
      console.log(movies);
    });

    this.router.navigateByUrl('/movies/tabs/repertoire');
    this.addMovie.reset();
  }

}
