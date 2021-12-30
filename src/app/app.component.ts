import { Component } from '@angular/core';
import { ConectionService } from './core/services/offline/conection/conection.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private conOffline: ConectionService
  ) {
    this.conOffline.databaseConn();
  }
}
