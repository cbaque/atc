import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Platform } from '@ionic/angular';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConectionService {

  readonly dbName: string = environment.databaseOffline;
  readonly dbTableUsers: string = "users";
  readonly dbTableDocs: string = "documents";
  readonly dbTableDocsDetails: string = "documents_details";
  readonly dbTablePhotos: string = "documents_photos";

  constructor(
    private sqlite: SQLite,
    private platform: Platform,
  ) { }

  databaseConn() {
    this.platform.ready().then(() => {
      this.sqlite.create({
        name: `${ this.dbName }`,
        location: 'default'
      })
        .then((db: SQLiteObject) => {
          // this.dbInstance = db;
          db.executeSql(
            `CREATE TABLE IF NOT EXISTS ${ this.dbTableUsers } (
              id INTEGER PRIMARY KEY, 
              username  varchar(255),
              nombres   varchar(255),
              password  varchar(255)
            )`
            , [])
            .then(() => {
              db.executeSql(
              `CREATE TABLE IF NOT EXISTS ${ this.dbTableDocs } (
                  id INTEGER PRIMARY KEY, 
                  nombre_edificacion        varchar(255),
                  direccion_edificacion     varchar(255),
                  numero_contacto           varchar(255),
                  pisos_sobre_suelo         varchar(255),
                  subsuelos                 varchar(255),
                  area_en_planta            varchar(255),
                  residencia_habitada       varchar(255),
                  residencia_no_habitada    varchar(255),
                  observation_amenaza_gen   varchar(255),
                  observation_amenaza_est   varchar(255),
                  observation_amenaza_no_est varchar(255),
                  observation_amenaza_geo   varchar(255),
                  observation_marcacion     varchar(255),
                  observation_medidas       varchar(255),
                  date_created              NUMERIC,
                  user_created              INTEGER,
                  coordinates               varchar(255)
                )`, [])
              .then( () => {
                // 
                db.executeSql( 
                `CREATE TABLE IF NOT EXISTS ${ this.dbTableDocsDetails } (
                  id INTEGER PRIMARY KEY, 
                  document_id               INTEGER,
                  type_lista                varchar(10),
                  code_lista                varchar(255),
                  value                     INTEGER,
                  observation               varchar(255),
                  little                    INTEGER,
                  moderate                  INTEGER,
                  severe                    INTEGER
                )`, [] )
                .then( () => {
                  //
                  db.executeSql(
                    `CREATE TABLE IF NOT EXISTS ${ this.dbTablePhotos } (
                      id INTEGER PRIMARY KEY, 
                      document_id               INTEGER,
                      photo_local               TEXT,
                      photo_serve               TEXT
                    )`, [] )
                    .then( () => console.log( 'Tablas creadas correctamente.' ))
                    .catch( e => console.log( 'error crear tabla photos' ) )
                })
                .catch( e => console.log('error crear table documents details', e) )
              })
              .catch( e => console.log('error crear table documents', e) )
            })
            .catch(e => console.log('error crear base', e));
        })
        .catch(e => console.log('error general ', e));
    })
  }

  open() {
    return this.sqlite.create({
      name: `${this.dbName}`,
      location: 'default'
    });
  }
}
