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
  readonly dbTablePhotos: string = "documents_photos";
  DOCUMENTS: Array <any> ;
  DOCUMENTS_DETAILS: Array <any> ;
  DOCUMENTS_PHOTOS: Array <any> ;

  constructor(
    private conOffline: ConectionService,
    private messageSrv: MessageService,
    private router: Router,
  ) { }

  public post( data: any, user: number ) {
    this.messageSrv.isLoading.next(true);
    const dateNow: String = new Date().toISOString();
    const coordinates = data.coordinates.latitude + ',' + data.coordinates.longitude;

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
                                        date_created,
                                        user_created,
                                        coordinates                                      
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
                                          '${ dateNow }',
                                          ${ user },
                                          '${ coordinates }'
                                        )`
        ,[]
      ).then( ( row: any ) => {

        let id = Number( row.insertId )

        // photos
        data.photos.forEach(element => {
          this.postPhotos( element, id )
        });

        data.photos_server.forEach(element => {
          this.postPhotosServer( element, id )
        });

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
        console.log('error cabecera', e)
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

  public postPhotos( img: any, id: number) {

    this.conOffline.open()
    .then( ( db ) => {
      db.executeSql(
        `INSERT INTO ${ this.dbTablePhotos } ( 
                                        document_id, 
                                        photo_local
                                        ) 
                                        VALUES 
                                        ( 
                                          '${ id }', 
                                          '${ img }'
                                        )`
        ,[]
      ).then( ( row: any ) => {
        console.log( 'photos', row )
        // alert(`Documento ${ data.nombre_edificacion } creado correctamente`)
      },( e ) => {
        console.log('error', e)
        alert( JSON.stringify(e.error))
      });
    }) 
  }

  public postPhotosServer( img: any, id: number) {

    this.conOffline.open()
    .then( ( db ) => {
      db.executeSql(
        `INSERT INTO ${ this.dbTablePhotos } ( 
                                        document_id, 
                                        photo_serve
                                        ) 
                                        VALUES 
                                        ( 
                                          '${ id }', 
                                          '${ img }'
                                        )`
        ,[]
      ).then( ( row: any ) => {
        console.log( 'photos', row )
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

  public editPhotos( id:number ) {
    return new Promise( ( resolve, reject ) => {
      this.conOffline.open()
        .then((db: SQLiteObject) => {
          db.executeSql(` SELECT * FROM ${ this.dbTablePhotos } WHERE document_id = ? AND photo_local != ''`, [ id ])
          .then( res => {
            this.DOCUMENTS_PHOTOS = [];
            if ( res.rows.length > 0 ) {
              for (let index = 0; index < res.rows.length; index++) {
                this.DOCUMENTS_PHOTOS.push(res.rows.item(index));
              }
            }
            resolve( this.DOCUMENTS_PHOTOS );
          }
          , ( e ) => {
            resolve(e)
          });
        })
        .catch(e => console.log('error general photos', e));  
    })    
  }

  public editPhotosServer( id:number ) {
    return new Promise( ( resolve, reject ) => {
      this.conOffline.open()
        .then((db: SQLiteObject) => {
          db.executeSql(` SELECT * FROM ${ this.dbTablePhotos } WHERE document_id = ? AND photo_serve != ''`, [ id ])
          .then( res => {
            this.DOCUMENTS_PHOTOS = [];
            if ( res.rows.length > 0 ) {
              for (let index = 0; index < res.rows.length; index++) {
                this.DOCUMENTS_PHOTOS.push(res.rows.item(index));
              }
            }
            resolve( this.DOCUMENTS_PHOTOS );
          }
          , ( e ) => {
            resolve(e)
          });
        })
        .catch(e => console.log('error general photos', e));  
    })    
  }

  public update( data: any, id: number ) {
    this.messageSrv.isLoading.next(true);
    const dateNow: String = new Date().toISOString();

    this.conOffline.open()
    .then( ( db ) => {
      db.executeSql(
        `UPDATE ${ this.dbTable }
        SET nombre_edificacion = '${ data.nombre_edificacion }', 
        direccion_edificacion = '${ data.direccion_edificacion }', 
        numero_contacto = '${ data.numero_contacto }',
        pisos_sobre_suelo = '${ data.pisos_sobre_suelo }',
        subsuelos = '${ data.subsuelos }',
        area_en_planta = '${ data.area_en_planta }',
        residencia_habitada = '${ data.residencia_habitada }',
        residencia_no_habitada = '${ data.residencia_no_habitada }',
        observation_amenaza_gen = '${ data.observation_amenaza_gen }',
        observation_amenaza_est = '${ data.observation_amenaza_est }',
        observation_amenaza_no_est = '${ data.observation_amenaza_no_est }',
        observation_amenaza_geo = '${ data.observation_amenaza_geo }',
        observation_marcacion = '${ data.observation_marcacion }',
        observation_medidas = '${ data.observation_medidas }',
        date_created = '${ dateNow }'
        WHERE id = ${ id }`
        ,[]
      ).then( ( row: any ) => {

        this.deleteDetails( id );
        this.deletePhotos( id );

        data.photos.forEach(element => {
          this.postPhotos( element, id )
        });

        data.photos_server.forEach(element => {
          this.postPhotosServer( element, id )
        });

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

  private deleteDetails( id: number ) {
    this.conOffline.open()
    .then( ( db ) => {
      db.executeSql(
        `DELETE FROM ${ this.dbTableDocsDetails } WHERE document_id = ${ id }`
        ,[]
      ).then( ( row: any ) => {
        console.log( 'delete detalle', row )
      },( e ) => {
        console.log('error', e)
        alert( JSON.stringify(e.error))
      });
    })
  }

  private deletePhotos( id: number ) {
    this.conOffline.open()
    .then( ( db ) => {
      db.executeSql(
        `DELETE FROM ${ this.dbTablePhotos } WHERE document_id = ${ id }`
        ,[]
      ).then( ( row: any ) => {
        console.log( 'delete photos', row )
      },( e ) => {
        console.log('error', e)
        alert( JSON.stringify(e.error))
      });
    })
  }
}
