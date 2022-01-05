import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { MensajeOfflineComponent } from './mensaje-offline/mensaje-offline.component';

@NgModule({
  declarations: [ HeaderComponent ],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
  ],
  exports: [
    HeaderComponent,
  ]
})
export class SharedModule { }
