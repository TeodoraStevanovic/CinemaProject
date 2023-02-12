import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CenovnikPageRoutingModule } from './cenovnik-routing.module';

import { CenovnikPage } from './cenovnik.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CenovnikPageRoutingModule
  ],
  declarations: [CenovnikPage]
})
export class CenovnikPageModule {}
