import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {BehaviorSubject} from 'rxjs';
import {User} from './user.model';
import {map, switchMap, take, tap} from 'rxjs/operators';
import {Users} from '../admin-users/users.model';

interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  localId: string;
  expiresIn: string;
  registered?: boolean;

}
interface UserData {
  name?: string;
  surname?: string;
  email: string;
  password: string;
  role: string;
}



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public currentUser = null;
  private userRole = 'user';
  private adminRole = 'admin';
  private _users = new BehaviorSubject<Users[]>([]);
  private _isUserAuthenticated = false;
  private _user = new BehaviorSubject<User>(null);
  constructor(private http: HttpClient) { }
  get users() {
    // eslint-disable-next-line no-underscore-dangle
    return this._users.asObservable();
  }
  get isUserAuthenticated(){
    // eslint-disable-next-line no-underscore-dangle
    return this._user.asObservable().pipe(
      map((user) => {
      if(user){
        return !!user.token;}
      else{
return false;
      }
    }));
  }
  get userId() {
    // eslint-disable-next-line no-underscore-dangle
    return this._user.asObservable().pipe(
      map((user) => {
        if (user) {
          return user.id;
        } else {
          return null;
        }
      })
    );
  }

  get token() {
    // eslint-disable-next-line no-underscore-dangle
    return this._user.asObservable().pipe(
      map((user) => {
        if (user) {
          return user.token;
        } else {
          return null;
        }
      })
    );
  }
  register(user: UserData){
    // eslint-disable-next-line no-underscore-dangle
    this._isUserAuthenticated = true;
    return this.http.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseAPIKey}`,
      {email: user.email,password:user.password,returnSecureToken:true}).pipe(
      tap((userData)=>{
        const expirationTime=new Date(new Date().getTime()+ +userData.expiresIn*1000);
        const newUser=new User(userData.localId,userData.email,userData.idToken,expirationTime);
        this.currentUser = newUser;
        console.log('current user: ' + this.currentUser.role);
        // eslint-disable-next-line no-underscore-dangle
        this._user.next(newUser);
        // eslint-disable-next-line no-underscore-dangle
        console.log('user' + this._user);
      }));
  }
  logIn(user: UserData) {
    // eslint-disable-next-line no-underscore-dangle
    this._isUserAuthenticated = true;
    return this.http.post<AuthResponseData>
    (`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseAPIKey}`,
      {email: user.email, password: user.password, returnSecureToken: true})
      .pipe(
        tap((userData)=> {
          const expirationTime=new Date(new Date().getTime()+ +userData.expiresIn * 1000);
          // eslint-disable-next-line @typescript-eslint/no-shadow
            const newUser=new User(userData.localId, userData.email, userData.idToken, expirationTime);
            this.currentUser=newUser;
          console.log('current user: ' + this.currentUser.email);
          // eslint-disable-next-line no-underscore-dangle
            this._user.next(newUser);
          }));}
  logOut() {
    // eslint-disable-next-line no-underscore-dangle
    this._user.next(null);
  }
  addNewUser(user: UserData){
    if(user.email === 'admin@admin.com'){
      this.addAdmin(user).subscribe(admin =>{
        //console.log(admin);
      });
    }else{
      this.addUser(user).subscribe(res =>{
        //console.log(res);
      });
    }
  }

  addAdmin(user: UserData){

    let generatedId;
    let admin: Users;

    return this.token.pipe(
      take(1),
      switchMap((token) => {
        admin = new Users(
          null,
          user.name,
          user.surname,
          user.email,
          this.adminRole
        );
        return this.http.post<{name: string}>(
          `https://cinema-moviestar-default-rtdb.europe-west1.firebasedatabase.app/users.json?auth=${token}`, admin);
      }),
      take(1),
      switchMap((resData) => {
        generatedId = resData.name;
        return this.users;
      }),
      take(1),
      tap((users) => {
        admin.id = generatedId;
        // eslint-disable-next-line no-underscore-dangle
        this._users.next(users.concat(admin));
      })
    );
  }

  addUser(user: UserData){

    let generatedId;
    let newUser: Users;

    return this.token.pipe(
      take(1),
      switchMap((token) => {
        newUser = new Users(
          null,
          user.name,
          user.surname,
          user.email,
          this.userRole
        );
        return this.http.post<{name: string}>(
          `https://cinema-moviestar-default-rtdb.europe-west1.firebasedatabase.app/users.json?auth=${token}`, newUser);
      }),
      take(1),
      switchMap((resData) => {
        generatedId = resData.name;
        return this.users;
      }),
      take(1),
      tap((users) => {
        newUser.id = generatedId;
        // eslint-disable-next-line no-underscore-dangle
        this._users.next(users.concat(newUser));
      })
    );
  }
}
