import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CenovnikPage } from './cenovnik.page';

const routes: Routes = [
  {
    path: '',
    component: CenovnikPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CenovnikPageRoutingModule {}
