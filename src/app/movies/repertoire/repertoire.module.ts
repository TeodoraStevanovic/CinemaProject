import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RepertoirePageRoutingModule } from './repertoire-routing.module';

import { RepertoirePage } from './repertoire.page';
import {MovieItemComponent} from '../movie-item/movie-item.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RepertoirePageRoutingModule,
    ReactiveFormsModule,
    Ng2SearchPipeModule,
  ],
    declarations: [RepertoirePage, MovieItemComponent]
})
export class RepertoirePageModule {}
