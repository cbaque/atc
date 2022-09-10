import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OficinaRoutingModule } from './oficina-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../shared/shared.module';
import { CreateComponent } from './create/create.component';


@NgModule({
  declarations: [
    CreateComponent
  ],
  imports: [
    CommonModule,
    OficinaRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule.forRoot(),
    SharedModule        
  ]
})
export class OficinaModule { }
