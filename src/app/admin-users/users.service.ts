import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user.model';
import { Users } from './users.model';

interface UserData {
  fullname: string;
  phoneNumber: string;
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private _users = new BehaviorSubject<Users[]>([]);

constructor(private http: HttpClient, private authService: AuthService) { }

get users() {
  // eslint-disable-next-line no-underscore-dangle
  return this._users.asObservable();
}

getUsers() {
  return this.authService.token.pipe(
    take(1),
    switchMap((token) => this.http.get<{[key: string]: UserData}>(
        `https://cinema-moviestar-default-rtdb.europe-west1.firebasedatabase.app/users.json?auth=${token}`
      )), map((userData: any) => {
      const users: Users[] = [];
      for(const key in userData){
        if(userData.hasOwnProperty(key) && userData[key].role === 'user'){
          users.push(new Users(key, userData[key].fullname, userData[key].phoneNumber, userData[key].email, userData[key].role)
          );
        }
      }
      return users;
    }),
    tap(users => {
      // eslint-disable-next-line no-underscore-dangle
      this._users.next(users);
    })
  );
}

getUser(id: string){
  return this.authService.token.pipe(
    take(1),
    switchMap((token) => this.http.get<UserData>(
        `https://cinema-moviestar-default-rtdb.europe-west1.firebasedatabase.app/users/${id}.json?auth=${token}`
      )), map((resData: UserData) => new Users(
          id,
          resData.fullname,
          resData.phoneNumber,
          resData.email,
          resData.role
        )
    )
  );
}
}
