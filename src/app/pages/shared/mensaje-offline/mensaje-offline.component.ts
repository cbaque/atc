import { Component, OnInit } from '@angular/core';
import { IonRouterOutlet, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mensaje-offline',
  templateUrl: './mensaje-offline.component.html',
  styleUrls: ['./mensaje-offline.component.scss'],
})
export class MensajeOfflineComponent implements OnInit {

  constructor(
    public viewCtrl: ModalController,
    private router: Router,
  ) { }

  ngOnInit() {}

}
