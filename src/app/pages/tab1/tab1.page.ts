import { Component } from '@angular/core';
import { DocumentsService } from '../../core/services/offline/documents/documents.service';
import { format, parseISO } from 'date-fns';
import { Router } from '@angular/router';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  DOCUMENTS: Array <any> = [];

  constructor(
    private docSrv: DocumentsService,
    private router: Router,
    private nativeStorage: NativeStorage,
  ) {
  }

  index() {
    this.nativeStorage.getItem('user').then( (res: any) => {
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

  edit( data: any ) {
    this.router.navigate(["/main/tabs/tab2", { id: data.id }]);
  }

}
