import { Component } from '@angular/core';
import {AuthService} from './auth/auth.service';
import {Router} from '@angular/router';
import {MenuController} from "@ionic/angular";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private authService: AuthService, private router: Router,private menu: MenuController) {
  }

  openMenuForUser() {
    this.menu.enable(true, 'adminMenu');
    this.menu.open('adminMenu');
  }

  openMenuForAdmin() {
    this.menu.enable(true, 'secondMenu');
    this.menu.open('secondMenu');
  }
  toggleTheme(event){
    if (event.detail.checked) {
      document.body.setAttribute('color-theme', 'dark');
    }else{document.body.setAttribute('color-theme','light');}
    }

  logout() {
    this.authService.logOut();
    this.router.navigateByUrl('/login');
    console.log('korisnik je izlogovan');

  }
}
