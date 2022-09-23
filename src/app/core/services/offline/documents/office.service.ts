import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SQLiteObject } from '@awesome-cordova-plugins/sqlite';
import { MessageService } from '../../message.service';
import { ConectionService } from '../conection/conection.service';

@Injectable({
  providedIn: 'root'
})
export class OfficeService {

  readonly dbTable: string = "documents_office";
  readonly dbTableDocsDetails: string = "documents_details_office";
  DOCUMENTS: Array <any> ;
  DOCUMENTS_DETAILS: Array <any> ;
  
  constructor(
    private conOffline: ConectionService,
    private messageSrv: MessageService,
    private router: Router,    
  ) { }

  post(  data: any, user: number ) {

    this.messageSrv.isLoading.next(true);
    const dateNow: String = new Date().toISOString();

    this.conOffline.open()
    .then( ( db ) => {
      db.executeSql(
        `INSERT INTO ${ this.dbTable } ( nombre_edificacion, 
                                        direccion_edificacion,
                                        codigo_castratal     ,
                                        anio_construccion    ,
                                        anio_remodelacion    ,
                                        anio_normativa       ,
                                        piso_sobre_subsuelo  ,
                                        piso_bajo_subsuelo   ,
                                        area_construccion    ,
                                        adiciones            ,
                                        date_created         ,
                                        user_created         
                                        ) 
                                        VALUES 
                                        ( 
                                          '${ data.nombre_edificacion }', 
                                          '${ data.direccion_edificacion }', 
                                          '${ data.codigo_castratal }',
                                          '${ data.anio_construccion_edificacion }',
                                          '${ data.anio_remodelacion_edificacion }',
                                          '${ data.anio_normativa }',
                                          '${ data.piso_subsuelo }',
                                          '${ data.piso_bajo_subsuelo }',
                                          '${ data.piso_area_construccion }',
                                          '${ data.piso_adiciones }',
                                          '${ dateNow }',
                                          ${ user }
                                        )`
        ,[]
      ).then( ( row: any ) => {
        debugger
        let id = Number( row.insertId )

        data.tipo_ocupacion.forEach( res => {
          this.postDetails( res , { id, type: 'TIPO_OCUPACION' } )
        });

        data.riesgo_geologico.forEach( res => {
          this.postDetails( res , 
          { 
            id, 
            type: 'RIESGO_GEOLOGICO', 
            yes     : ( res.options ) ? res.options[0].selected : 0, 
            no      : ( res.options ) ? res.options[1].selected : 0, 
            dnk     : ( res.options ) ? res.options[2].selected : 0 
          })
        });     
        
        data.adyacencia.forEach( res => {
          this.postDetails( res , 
          { 
            id, 
            type: 'ADYACENCIA', 
            yes     : ( res.options ) ? res.options[0].selected : 0, 
            no      : ( res.options ) ? res.options[1].selected : 0, 
            dnk     : ( res.options ) ? res.options[2].selected : 0 
          })
        });  
        
        data.irregularidad.forEach( res => {
          this.postDetails( res , 
          { 
            id, 
            type: 'IRREGULARIDAD', 
            yes     : ( res.options ) ? res.options[0].selected : 0, 
            no      : ( res.options ) ? res.options[1].selected : 0, 
            dnk     : ( res.options ) ? res.options[2].selected : 0 
          })
        }); 
        
        data.caida_exterior.forEach( res => {
          this.postDetails( res , 
          { 
            id, 
            type: 'CAIDA_EXTERIOR', 
            yes     : ( res.options ) ? res.options[0].selected : 0, 
            no      : ( res.options ) ? res.options[1].selected : 0, 
            dnk     : ( res.options ) ? res.options[2].selected : 0 
          })
        }); 
        
        data.tipologia_estructural.forEach( res => {
          this.postDetails( res , { id, type: 'TIPOLOGIA_ESTRUCTURAL' } )
        });  
        
        data.otros_riesgos.forEach( res => {
          this.postDetails( res , { id, type: 'OTROS_RIESGOS' } )
        });   
        
        data.accion_requerida_e.forEach( res => {
          this.postDetails( res , { id, type: 'ACCION_REQUERIDA_E' } )
        });  
        
        data.accion_requerida_ne.forEach( res => {
          this.postDetails( res , { id, type: 'ACCION_REQUERIDA_NE' } )
        });            

        setTimeout(() => {
          this.messageSrv.isLoading.next(false);
          this.router.navigate(["/main/tabs/oficina-list"]);
        }, 2000);


      },( e ) => {
        this.messageSrv.isLoading.next(false);
        console.log('error cabecera', e)
        alert( JSON.stringify(e.error))
      });
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
                                        yes,
                                        no,
                                        dnk
                                        ) 
                                        VALUES 
                                        ( 
                                          '${ varios.id }', 
                                          '${ varios.type }', 
                                          '${ data.code }',
                                          '${ (Boolean(data.selected)) ? 1 : 0 }',
                                          '${ (data.observation) ? data.observation : '' }',
                                          '${ (Boolean(varios.yes)) ? 1 : 0 }',
                                          '${ (Boolean(varios.no)) ? 1 : 0 }',
                                          '${ (Boolean(varios.dnk)) ? 1 : 0 }'
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

  public get( id: number ) {
    return new Promise( ( resolve, reject ) => {
      this.conOffline.open()
        .then((db: SQLiteObject) => {
          db.executeSql(` SELECT * FROM ${ this.dbTable } WHERE user_created = ?`, [ id ])
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
