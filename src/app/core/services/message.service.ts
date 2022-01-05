import { Injectable } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { MensajeOfflineComponent } from '../../pages/shared/mensaje-offline/mensaje-offline.component';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  isLoading = new BehaviorSubject(false);
  constructor(
    public modalController: ModalController,
    public toastController: ToastController
  ) { }

  async openModalOffline() {
    const toast = await this.toastController.create({
      message: 'Verifique conexión a red',
      duration: 3000,
      color: 'warning',
      icon: 'information-circle',
      buttons: [{
          text: 'OK',
          role: 'cancel',
          handler: () => {
            // console.log('Cancel clicked');
          }
        }
      ]      
    });
    toast.present();
  }
}
