import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../auth.service';
import {AlertController, LoadingController} from '@ionic/angular';
import {Router} from '@angular/router';

@Component({
  selector: 'app-singup',
  templateUrl: './singup.page.html',
  styleUrls: ['./singup.page.scss'],
})
export class SingupPage implements OnInit {
  registerForm: FormGroup;
//passwordType: string='password';
//passwordShown:boolean= 'false';

  constructor(private authService: AuthService, private loadingController: LoadingController, private router: Router, private alertController: AlertController) {
    this.registerForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      surname: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(8)]),
    });
  }

  ngOnInit() {
  }

  onRegister() {
    this.loadingController.create({message: 'Registering...'}).then((loadingEl) => {
      loadingEl.present();
      this.authService.register(this.registerForm.value).subscribe(resData => {
        console.log('Registracija je uspesno izvrsena!');
        console.log(resData);
        this.authService.addNewUser(this.registerForm.value);
        loadingEl.dismiss();
        this.router.navigateByUrl('/movies');
      }, errRes => {
        console.log(errRes);
        loadingEl.dismiss();
        let message = 'Greška prilikom registracije';

        const code = errRes.error.error.message;
        if (code === 'EMAIL_EXISTS') {
          message = 'Korisnik sa ovom email adresom već postoji.';
        }

        this.alertController.create({
          header: 'Greška',
          message,
          buttons: ['OK']
        }).then((alert) => {
          alert.present();
        });
        if (this.registerForm.valid) {
          this.registerForm.reset();
        }
      });
    });
  }
}

