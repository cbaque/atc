import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Platform } from '@ionic/angular';
import { ConectionService } from '../conection/conection.service';
import { Router } from '@angular/router';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { MessageService } from '../../message.service';

@Injectable({
  providedIn: 'root'
})
export class OffUserService {

  readonly dbTable: string = "users";
  USERS: Array <any> ;
  
  constructor(
    private conOffline: ConectionService,
    private router: Router,
    private nativeStorage: NativeStorage,
    private messageSrv: MessageService
  ) { 
  }
  
  public post( data: any ) {
    this.messageSrv.isLoading.next(true);
    this.conOffline.open()
    .then( ( db ) => {
      db.executeSql(
        `INSERT INTO ${ this.dbTable } ( username, nombres, password ) VALUES ( '${ data.username }', '${ data.nombres }', '${ data.password }' )`
        ,[]
      ).then( ( row : any ) => {
        this.messageSrv.isLoading.next(false);
        let id = Number( row.insertId )
        data.id = id;
        this.nativeStorage.setItem('user', data);
        this.router.navigate(["/main/tabs/tab1"]);
        // alert('ok')
      },( e ) => {
        this.messageSrv.isLoading.next(false);
        console.log('error', e)
        alert( JSON.stringify(e.error))
      });
    })
    
  }

  public get() {
    return new Promise( ( resolve, reject ) => {
      this.conOffline.open()
        .then((db: SQLiteObject) => {
          db.executeSql(` SELECT * FROM ${ this.dbTable } `, [])
          .then( res => {
            this.USERS = [];
            if ( res.rows.length > 0 ) {
              for (let index = 0; index < res.rows.length; index++) {
                this.USERS.push(res.rows.item(index));
              }
            }
            resolve( this.USERS );
          }
          , ( e ) => {
            resolve(e)
          });
        })
        .catch(e => console.log('error general ', e));  
    })
  }
}
