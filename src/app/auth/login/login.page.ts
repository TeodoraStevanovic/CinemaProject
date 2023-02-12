import { Component, OnInit } from '@angular/core';
import {AuthService} from '../auth.service';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {AlertController} from '@ionic/angular';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  isLoading=false;

  constructor(private authService: AuthService, private router: Router, private alertController: AlertController) { }

  ngOnInit() {
  }

  onLogin(form: NgForm) {
    this.isLoading=true;
    console.log(form);
    if (form.valid) {
      this.authService.logIn(form.value).subscribe(resData=>{
        console.log('Prijava je uspesno izvrsena!');
        this.isLoading=false;
        console.log(resData); this.router.navigateByUrl('/movies'); form.reset(); },
        errRes =>{
        console.log(errRes);
        this.isLoading=false;
       let message='Pogrešna lozinka ili  email!';
          const code=errRes.error.error.message;
          if (code==='EMAIL_NOT_FOUND'){
            message='Pogrešna email adresa.';
          }else if (code==='INVALID_PASSWORD') {
            message='Pogrešna lozinka.';
          }
this.alertController.create({
  header:'Neuspešna autentifikacija!',
  message,
  buttons:['Okay']
}).then((alert)=>{
  alert.present();
});form.reset();
        });
    }}}
