import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { format, parseISO } from 'date-fns';
import { OfficeService } from 'src/app/core/services/offline/documents/office.service';

@Component({
  selector: 'app-oficina-index',
  templateUrl: './oficina-index.component.html',
  styleUrls: ['./oficina-index.component.scss'],
})
export class OficinaIndexComponent implements OnInit {
  DOCUMENTS: Array <any> = [];
  DATOS_USER: any;
  constructor(
    private docSrv: OfficeService,
    private router: Router,
    private nativeStorage: NativeStorage,
  ) { }

  ngOnInit() {}


  index() {
    this.nativeStorage.getItem('user').then( (res: any) => {
      this.DATOS_USER = res;
      this.docSrv.get( Number( res.id ) )
      .then( ( res: [] ) => {
        if ( res ) {
          this.DOCUMENTS = res;
        }else {
          // alert('Credenciales incorrectas.')
        }
      });
    });

  }

  setFormatDate( date: any) {
    return format(parseISO( date ), 'MMM d, yyyy HH:mm');
  }

  ionViewDidEnter() {
    this.index();
  }

}
