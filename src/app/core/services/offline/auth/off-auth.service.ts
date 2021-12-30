import { Injectable } from '@angular/core';
import { SQLiteObject } from '@ionic-native/sqlite/ngx';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { Router } from '@angular/router';
import { ConectionService } from '../conection/conection.service';

@Injectable({
  providedIn: 'root'
})
export class OffAuthService {
  readonly dbTable: string = "users";
  constructor(
    private conOffline: ConectionService,
    private nativeStorage: NativeStorage,
    private router: Router, 
  ) { }

  public get( data: any ) {
    return new Promise( ( resolve, reject ) => {
      this.conOffline.open()
        .then((db: SQLiteObject) => {
          db.executeSql(` SELECT * FROM ${ this.dbTable } WHERE username = ? AND password = ?`, [ data.username, data.password ])
          .then( res => {
            let data: {}
            if ( res.rows.item(0) ) {
              data = { ... res.rows.item(0) }
            }
            resolve( data );
          }
          , ( e ) => {
            resolve( null )
          });
        })
        .catch(e => console.log('error general ', e));  
    })
  }

  public logout() {
    // this.nativeStorage.remove('user');
    this.router.navigate(["/login"]);
  }
}
