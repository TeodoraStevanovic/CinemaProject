import {Component} from '@angular/core';
import {AuthService} from '../auth/auth.service';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.page.html',
  styleUrls: ['./movies.page.scss'],
})
export class MoviesPage{
  constructor(public authService: AuthService) {}
}
