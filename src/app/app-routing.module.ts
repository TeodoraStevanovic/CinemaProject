import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {AuthGuard} from './auth/auth.guard';

const routes: Routes = [
   {path: 'login',
    loadChildren: () => import('./auth/login/login.module').then( m => m.LoginPageModule)
  },
  { path: 'movies',
      loadChildren: () => import('./movies/movies.module').then(m => m.MoviesPageModule),
    canLoad: [AuthGuard]
     },
  {
    //ovde posle podesi redirekciju na login
    //a sad prvo moze na movies
    path: '',
    redirectTo: 'movies',
    pathMatch: 'full'
  },
  {
    path: 'kontakt',
    loadChildren: () => import('./kontakt/kontakt.module').then(m => m.KontaktPageModule)
  },
  {
    path: 'cenovnik',
    loadChildren: () => import('./cenovnik/cenovnik.module').then(m => m.CenovnikPageModule)
  },
  {
    path: 'singup',
    loadChildren: () => import('./auth/singup/singup.module').then( m => m.SingupPageModule)
  },
  {
    path: 'admin-reservations',
    loadChildren: () => import('./admin-reservations/admin-reservations.module').then( m => m.AdminReservationsPageModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'admin-users',
    loadChildren: () => import('./admin-users/admin-users.module').then( m => m.AdminUsersPageModule),
    canLoad: [AuthGuard]
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
