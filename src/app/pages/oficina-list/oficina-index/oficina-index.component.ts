import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { Network } from '@awesome-cordova-plugins/network/ngx';
import { format, parseISO } from 'date-fns';
import { MessageService } from 'src/app/core/services/message.service';
import { OfficeService } from 'src/app/core/services/offline/documents/office.service';
import { DocumentsOnService } from 'src/app/core/services/online/documents-on.service';

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
    private network: Network,
    private smsSrv: MessageService,
    private docOnSrv: DocumentsOnService,
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

  edit( data: any ) {
    this.router.navigate(["/main/tabs/oficina", { id: data.id }]);
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
            this.docOnSrv.postOffice( data )
            .subscribe( (response: any) => {

              setTimeout(() => {
                this.smsSrv.closeLoading();
                this.smsSrv.openSuccess( response[0] );
              }, 2000);

              // this.docSrv.editPhotosServer( id )
              // .then( (pho: any) =>  {
                
              //   if ( pho) {
              //     pho.forEach(element => {
              //       this.uploadImg( element.photo_serve, id )
              //     });
              //   }

              //   setTimeout(() => {
              //     this.smsSrv.closeLoading();
              //     this.smsSrv.openSuccess( response[0] );
              //   }, 2000);

              // })
            }, 
            (err) => {
              setTimeout(() => {
                this.smsSrv.closeLoading();
                this.smsSrv.openSuccess( 'ERRRO AL SUBIR ARCHIVO' );
              }, 2000);
            })

          }
        })
      }
    });
  }

}
