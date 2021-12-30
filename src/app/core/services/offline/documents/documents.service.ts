import { Injectable } from '@angular/core';
import { SQLiteObject } from '@awesome-cordova-plugins/sqlite';
import { ConectionService } from '../conection/conection.service';
import { MessageService } from '../../message.service';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class DocumentsService {

  readonly dbTable: string = "documents";
  readonly dbTableDocsDetails: string = "documents_details";
  DOCUMENTS: Array <any> ;
  DOCUMENTS_DETAILS: Array <any> ;

  constructor(
    private conOffline: ConectionService,
    private messageSrv: MessageService,
    private router: Router,
  ) { }

  public post( data: any ) {
    this.messageSrv.isLoading.next(true);
    const dateNow: String = new Date().toISOString();

    this.conOffline.open()
    .then( ( db ) => {
      db.executeSql(
        `INSERT INTO ${ this.dbTable } ( nombre_edificacion, 
                                        direccion_edificacion, 
                                        numero_contacto,
                                        pisos_sobre_suelo,
                                        subsuelos,
                                        area_en_planta,
                                        residencia_habitada,
                                        residencia_no_habitada,
                                        observation_amenaza_gen,
                                        observation_amenaza_est,
                                        observation_amenaza_no_est,
                                        observation_amenaza_geo,
                                        observation_marcacion,
                                        observation_medidas,
                                        date_created                                      
                                        ) 
                                        VALUES 
                                        ( 
                                          '${ data.nombre_edificacion }', 
                                          '${ data.direccion_edificacion }', 
                                          '${ data.numero_contacto }',
                                          '${ data.pisos_sobre_suelo }',
                                          '${ data.subsuelos }',
                                          '${ data.area_en_planta }',
                                          '${ data.residencia_habitada }',
                                          '${ data.residencia_no_habitada }',
                                          '${ data.observation_amenaza_gen }',
                                          '${ data.observation_amenaza_est }',
                                          '${ data.observation_amenaza_no_est }',
                                          '${ data.observation_amenaza_geo }',
                                          '${ data.observation_marcacion }',
                                          '${ data.observation_medidas }',
                                          '${ dateNow }'
                                        )`
        ,[]
      ).then( ( row: any ) => {

        // console.log( 'datos posteo', data )

        let id = Number( row.insertId )
        data.tipo_construccion.forEach( res => {
          this.postDetails( res , { id, type: 'TIPO_CONSTRUCCION' } )
        });

        data.tipo_educacion.forEach( res => {
          this.postDetails( res , { id, type: 'TIPO_EDUCACION' } )
        });

        data.tipo_amenaza_general.forEach( res => {
          this.postDetails( res , 
          { 
            id, 
            type: 'AMENAZA_GENERAL', 
            little    : ( res.options ) ? res.options[0].selected : 0, 
            moderate  : ( res.options ) ? res.options[1].selected : 0, 
            severe    : ( res.options ) ? res.options[2].selected : 0 
          })
        });

        data.tipo_amenaza_estructural.forEach( res => {
          this.postDetails( res , 
            { 
              id, 
              type: 'AMENAZA_ESTRUCTURAL', 
              little    : ( res.options ) ? res.options[0].selected : 0, 
              moderate  : ( res.options ) ? res.options[1].selected : 0, 
              severe    : ( res.options ) ? res.options[2].selected : 0 
            })
        });

        data.tipo_amenaza_no_estructural.forEach( res => {
          this.postDetails( res , 
            { 
              id, 
              type: 'AMENAZA_NO_ESTRUCTURAL',
              little    : ( res.options ) ? res.options[0].selected : 0, 
              moderate  : ( res.options ) ? res.options[1].selected : 0, 
              severe    : ( res.options ) ? res.options[2].selected : 0 
            }  )
        });

        data.tipo_amenaza_geotecnica.forEach( res => {
          this.postDetails( res , 
            { 
              id, 
              type: 'AMENAZA_GEOTECNICA', 
              little    : ( res.options ) ? res.options[0].selected : 0, 
              moderate  : ( res.options ) ? res.options[1].selected : 0, 
              severe    : ( res.options ) ? res.options[2].selected : 0  
            }  )
        });

        data.tipo_estimacion_danio.forEach( res => {
          this.postDetails( res , 
            { 
              id, 
              type: 'ESTIMACION_DANIO', 
              little    : ( res.options ) ? res.options[0].selected : 0, 
              moderate  : ( res.options ) ? res.options[1].selected : 0, 
              severe    : ( res.options ) ? res.options[2].selected : 0 
            })
        });

        data.tipo_marcacion.forEach( res => {
          this.postDetails( res , 
            { 
              id, 
              type: 'MARCACION', 
              little    : ( res.options ) ? res.options[0].selected : 0, 
              moderate  : ( res.options ) ? res.options[1].selected : 0, 
              severe    : ( res.options ) ? res.options[2].selected : 0 
            })
        });

        data.tipo_pancarta.forEach( res => {
          this.postDetails( res , { 
            id, 
            type: 'PANCARTA', 
            little    : ( res.options ) ? res.options[0].selected : 0, 
            moderate  : ( res.options ) ? res.options[1].selected : 0, 
            severe    : ( res.options ) ? res.options[2].selected : 0  
          })
        });

        data.tipo_medidas.forEach( res => {
          this.postDetails( res , { id, type: 'TIPO_MEDIDAS' } )
        });

        setTimeout(() => {
          this.messageSrv.isLoading.next(false);
          this.router.navigate(["/main/tabs/tab1"]);
        }, 2000);


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
            this.DOCUMENTS = [];
            if ( res.rows.length > 0 ) {
              for (let index = 0; index < res.rows.length; index++) {
                this.DOCUMENTS.push(res.rows.item(index));
              }
            }
            resolve( this.DOCUMENTS );
          }
          , ( e ) => {
            resolve(e)
          });
        })
        .catch(e => console.log('error general ', e));  
    })
  }

  public postDetails( data: any, varios: any) {

    this.conOffline.open()
    .then( ( db ) => {
      db.executeSql(
        `INSERT INTO ${ this.dbTableDocsDetails } ( 
                                        document_id, 
                                        type_lista, 
                                        code_lista,
                                        value,
                                        observation,
                                        little,
                                        moderate,
                                        severe
                                        ) 
                                        VALUES 
                                        ( 
                                          '${ varios.id }', 
                                          '${ varios.type }', 
                                          '${ data.code }',
                                          '${ (Boolean(data.selected)) ? 1 : 0 }',
                                          '${ (data.observation) ? data.observation : '' }',
                                          '${ (Boolean(varios.little)) ? 1 : 0 }',
                                          '${ (Boolean(varios.moderate)) ? 1 : 0 }',
                                          '${ (Boolean(varios.severe)) ? 1 : 0 }'
                                        )`
        ,[]
      ).then( ( row: any ) => {
        console.log( 'datos_detalle', row )
        // alert(`Documento ${ data.nombre_edificacion } creado correctamente`)
      },( e ) => {
        console.log('error', e)
        alert( JSON.stringify(e.error))
      });
    }) 


  }

  public edit( id:number ) {
    return new Promise( ( resolve, reject ) => {
      this.conOffline.open()
        .then((db: SQLiteObject) => {
          db.executeSql(` SELECT * FROM ${ this.dbTable } WHERE id = ? `, [ id ])
          .then( res => {
            this.DOCUMENTS = [];
            if ( res.rows.length > 0 ) {
              for (let index = 0; index < res.rows.length; index++) {
                this.DOCUMENTS.push(res.rows.item(index));
              }
            }
            resolve( this.DOCUMENTS );
          }
          , ( e ) => {
            resolve(e)
          });
        })
        .catch(e => console.log('error general ', e));  
    })    
  }

  public editDetails( id:number ) {
    return new Promise( ( resolve, reject ) => {
      this.conOffline.open()
        .then((db: SQLiteObject) => {
          db.executeSql(` SELECT * FROM ${ this.dbTableDocsDetails } WHERE document_id = ? `, [ id ])
          .then( res => {
            this.DOCUMENTS_DETAILS = [];
            if ( res.rows.length > 0 ) {
              for (let index = 0; index < res.rows.length; index++) {
                this.DOCUMENTS_DETAILS.push(res.rows.item(index));
              }
            }
            resolve( this.DOCUMENTS_DETAILS );
          }
          , ( e ) => {
            resolve(e)
          });
        })
        .catch(e => console.log('error general ', e));  
    })    
  }
}
