import { Component, OnInit } from '@angular/core';
import {Users} from '../users.model';
import {ActivatedRoute} from '@angular/router';
import {UsersService} from '../users.service';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.page.html',
  styleUrls: ['./user-details.page.scss'],
})
export class UserDetailsPage implements OnInit {


  user: Users;
  isLoading = false;
  // @ts-ignore
  private userSub: Subscription;

  // @ts-ignore
  constructor(
    private route: ActivatedRoute,
    private usersService: UsersService,
    private navCtrl: NavController,
    private authService: AuthService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('userId')) {
        this.navCtrl.navigateBack('/admin-users');
        return;
      }

      this.isLoading = true;

      this.usersService
        .getUser(paramMap.get('userId'))
        .subscribe((user) => {
          this.user = user;
          this.isLoading = false;
        });
    });
  }

}
