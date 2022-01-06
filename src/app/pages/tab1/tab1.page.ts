import { Component } from '@angular/core';
import { DocumentsService } from '../../core/services/offline/documents/documents.service';
import { format, parseISO } from 'date-fns';
import { Router } from '@angular/router';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { Network } from '@awesome-cordova-plugins/network/ngx';
import { MessageService } from '../../core/services/message.service';
import { DocumentsOnService } from 'src/app/core/services/online/documents-on.service';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@awesome-cordova-plugins/file-transfer/ngx';
import { environment } from 'src/environments/environment';

const apiUlr = environment.apiUrl;

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  DOCUMENTS: Array <any> = [];
  DATOS_USER: any;

  constructor(
    private docSrv: DocumentsService,
    private router: Router,
    private nativeStorage: NativeStorage,
    private network: Network,
    private smsSrv: MessageService,
    private docOnSrv: DocumentsOnService,
    private fileSrv: FileTransfer,
  ) {
  }

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

  edit( data: any ) {
    this.router.navigate(["/main/tabs/tab2", { id: data.id }]);
  }

  upLoad( id: number ) {

    if ( this.network.type === 'none' ) {
      this.smsSrv.openModalOffline();
      return false;
    }

    this.smsSrv.openLoading();

    let data = { cabecera : null, detalles : null, usuario: null };

    this.docSrv.edit( id )
    .then( res => {
      if ( res ) {
        data.cabecera = res;
        this.docSrv.editDetails( id )
        .then( det => {
          if ( det ) {
            data.detalles = det;
            this.docOnSrv.post( data )
            .subscribe( (response: any) => {

              this.docSrv.editPhotosServer( id )
              .then( (pho: any) =>  {
                console.log( pho )
                if ( pho) {
                  pho.forEach(element => {
                    this.uploadImg( element.photo_serve, id )
                  });
                }

                setTimeout(() => {
                  this.smsSrv.closeLoading();
                  this.smsSrv.openSuccess( response[0] );
                }, 2000);

              })
            })

          }
        })
      }
    });
  }


  uploadImg( img, id:number ) {
    const options: FileUploadOptions = {
      fileKey: 'image',
      fileName: Date.now()+'.jpg',
      params: {
        id: id
      }
    };

    console.log(  options )

    const fileTransfer: FileTransferObject = this.fileSrv.create();

    fileTransfer.upload( img, `${ apiUlr }documents/upload`, options )
  }

}
