import { Component } from '@angular/core';
import { DocumentsService } from '../../core/services/offline/documents/documents.service';
import { format, parseISO } from 'date-fns';
import { Router } from '@angular/router';

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
  ) {
  }

  index() {
    this.docSrv.get()
    .then( ( res: [] ) => {
      if ( res ) {
        this.DOCUMENTS = res;
      }else {
        alert('Credenciales incorrectas.')
      }
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
