import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MoviesPage } from './movies.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: MoviesPage,
    children:[
      {
        path: 'repertoire',
        loadChildren: () => import('./repertoire/repertoire.module').then( m => m.RepertoirePageModule)
      },
      {
        path: 'add-new',
        loadChildren: () => import('./add-new/add-new.module').then( m => m.AddNewPageModule)
      },
      {
        path: 'reservations',
        loadChildren: () => import('./reservations/reservations.module').then( m => m.ReservationsPageModule)
      },
      {
        path: '',
        redirectTo: '/movies/tabs/repertoire',
        pathMatch: 'full'
      },
    ]
  },
  {
    path: '',
    redirectTo: '/movies/tabs/repertoire',
    pathMatch: 'full'
  },
  {
    path: 'reservations',
    loadChildren: () => import('./reservations/reservations.module').then( m => m.ReservationsPageModule)
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MoviesPageRoutingModule {}
