import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OficinaListRoutingModule } from './oficina-list-routing.module';
import { OficinaIndexComponent } from './oficina-index/oficina-index.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    OficinaIndexComponent
  ],
  imports: [
    CommonModule,
    OficinaListRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule.forRoot(),
    SharedModule      
  ]
})
export class OficinaListModule { }
