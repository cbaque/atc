import { ChangeDetectorRef, Component } from '@angular/core';
import { ListasService } from 'src/app/core/services/listas/listas.service';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DocumentsService } from '../../core/services/offline/documents/documents.service';
import { MessageService } from '../../core/services/message.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';

declare var window: any;

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page { 
  COORDENADAS                   : any;
  tmpImages                     : string[] = [];
  docForm                       : FormGroup;

  tipoConstruccionArr           : FormArray;
  tipoEducacionArr              : FormArray;
  tipoAmenazaGeneralArr         : FormArray;
  tipoAmenazaEstructuralesArr   : FormArray;
  tipoAmenazaNoEstructuralesArr : FormArray;
  tipoAmenazaGeotecnicasArr     : FormArray;
  tipoEstimacionDanioArr        : FormArray;
  tipoMarcacionArr              : FormArray;
  tipoPancartaArr               : FormArray;
  tipoMedidasArr                : FormArray;
  loading                       : boolean = false;
  dateSelected;
  id: any;
  photosArr                     : FormArray;

  constructor(
    private listaSrv: ListasService,
    private geolocation: Geolocation,
    private camera: Camera,
    private formBuilder: FormBuilder,
    private docSrv: DocumentsService,
    private messageSrv: MessageService,
    private route: ActivatedRoute,
    private changeDetector : ChangeDetectorRef,
    private nativeStorage: NativeStorage,
  ) {
    this.dateSelected = {};
    this.messageSrv.isLoading.subscribe( res => this.loading = res );

    this.geolocation.getCurrentPosition().then((resp) => {
      this.COORDENADAS = { latitude: resp.coords.latitude, longitude : resp.coords.longitude  }
     }).catch((error) => {
       console.log('Error getting location', error);
     });
     
     this.docForm = this.createForm();
     this.getTipoConstruccion();
     this.getTipoEducacion();
     this.getTipoAmenaza();
     this.getTipoAmenazaEstructurales();
     this.getTipoAmenazaNoEstructurales();
     this.getTipoAmenazaGeotecnicas();
     this.getTipoEstimacionDanios();
     this.getTipoMarcacion();
     this.getTipoParcarta();
     this.getTipoMedidas();
  }

  createForm() {
    return this.formBuilder.group({
      nombre_edificacion        : [ '', Validators.required ],
      direccion_edificacion     : [ '' ],
      numero_contacto           : [ '' ],
      pisos_sobre_suelo         : [ '' ],
      subsuelos                 : [ '' ],
      area_en_planta            : [ '' ],
      residencia_habitada       : [ '' ],
      residencia_no_habitada    : [ '' ],
      observation_amenaza_gen   : new FormControl( '' ),
      observation_amenaza_est   : new FormControl( '' ),
      observation_amenaza_no_est: new FormControl( '' ),
      observation_amenaza_geo   : new FormControl( '' ),
      observation_marcacion     : new FormControl( '' ),
      observation_medidas       : new FormControl( '' ),
      tipo_construccion         : this.formBuilder.array([]),
      tipo_educacion            : this.formBuilder.array([]),
      tipo_amenaza_general      : this.formBuilder.array([]),
      tipo_amenaza_estructural  : this.formBuilder.array([]),
      tipo_amenaza_no_estructural  : this.formBuilder.array([]),
      tipo_amenaza_geotecnica   : this.formBuilder.array([]),
      tipo_estimacion_danio     : this.formBuilder.array([]),
      tipo_marcacion            : this.formBuilder.array([]),
      tipo_pancarta             : this.formBuilder.array([]),
      tipo_medidas              : this.formBuilder.array([]),
      coordinates               : new FormControl( '' ),
      photos                    : []
    });
  }

  getTipoMedidas() {
    this.tipoMedidasArr = this.docForm.get('tipo_medidas') as FormArray;
    this.listaSrv.getTipoMedidas().subscribe(
      (res: []) => {
        res.forEach( (element, index) => {
          this.tipoMedidasArr.push(
            this.formBuilder.group({
              code : element['code'],
              name: element['name'],
              selected: false,
              observation: new FormControl()
            })
          )          
        });
      }
    )      
  }

  getTipoParcarta() {
    this.tipoPancartaArr = this.docForm.get('tipo_pancarta') as FormArray;
    this.listaSrv.getTipoPancarta().subscribe(
      (res: []) => {
        res.forEach( (element, index) => {
          this.tipoPancartaArr.push(
            this.formBuilder.group({
              code : element['code'],
              name: element['name'],
              selected: false
            })
          )          
        });
      }
    )  
  }

  getTipoMarcacion() {
    this.tipoMarcacionArr = this.docForm.get('tipo_marcacion') as FormArray;
    this.listaSrv.getTipoMarcacion().subscribe(
      (res: []) => {
        res.forEach( (element, index) => {
          this.tipoMarcacionArr.push(
            this.formBuilder.group({
              code : element['code'],
              name: element['name'],
              selected: false
            })
          )          
        });
      }
    )  
  }

  getTipoEstimacionDanios() {
    this.tipoEstimacionDanioArr = this.docForm.get('tipo_estimacion_danio') as FormArray;
    this.listaSrv.getTipoEstimacionDanios().subscribe(
      (res: []) => {
        res.forEach( (element, index) => {
          this.tipoEstimacionDanioArr.push(
            this.formBuilder.group({
              code : element['code'],
              name: element['name'],
              selected: false
            })
          )          
        });        
      }
    )      
  }

  getTipoAmenazaGeotecnicas() {
    this.tipoAmenazaGeotecnicasArr = this.docForm.get('tipo_amenaza_geotecnica') as FormArray;
    this.listaSrv.getTipoAmenazaGeotecnicas().subscribe(
      (res: []) => {
        res.forEach( (element, index) => {
          let datatmp = [];
          datatmp.push( element['options'] )
          this.tipoAmenazaGeotecnicasArr.push(
            this.formBuilder.group({
              code : element['code'],
              name: element['name'],
              options: datatmp
            })
          )          
        }); 
      }
    )      
  }

  getTipoAmenazaNoEstructurales() {
    this.tipoAmenazaNoEstructuralesArr = this.docForm.get('tipo_amenaza_no_estructural') as FormArray;
    this.listaSrv.getTipoAmenazaNoEstructurales().subscribe(
      (res: []) => {
        res.forEach( (element, index) => {
          let datatmp = [];
          datatmp.push( element['options'] )
          this.tipoAmenazaNoEstructuralesArr.push(
            this.formBuilder.group({
              code : element['code'],
              name: element['name'],
              options: datatmp
            })
          )          
        }); 
      }
    )  
  }

  getTipoAmenazaEstructurales() {
    this.tipoAmenazaEstructuralesArr = this.docForm.get('tipo_amenaza_estructural') as FormArray;
    this.listaSrv.getTipoAmenazaEstructurales().subscribe(
      (res: []) => {
        res.forEach( (element, index) => {
          let datatmp = [];
          datatmp.push( element['options'] )
          this.tipoAmenazaEstructuralesArr.push(
            this.formBuilder.group({
              code : element['code'],
              name: element['name'],
              options: datatmp
            })
          )          
        });        
      }
    )     
  }

  getTipoAmenaza() {
    this.tipoAmenazaGeneralArr = this.docForm.get('tipo_amenaza_general') as FormArray;

    this.listaSrv.getTipoAmenazaGeneral().subscribe(
      (res: []) => {
        res.forEach( (element, index) => {
          let datatmp = [];
          datatmp.push( element['options'] )
          this.tipoAmenazaGeneralArr.push(
            this.formBuilder.group({
              code : element['code'],
              name: element['name'],
              options: datatmp
            })
          )          
        });
      }
    ) 
  }

  getTipoEducacion() {

    this.tipoEducacionArr = this.docForm.get('tipo_educacion') as FormArray;
    this.listaSrv.getTipoEducacion().subscribe(
      (res: []) => {
        res.forEach( (element, index) => {
          this.tipoEducacionArr.push(
            this.formBuilder.group({
              code : element['code'],
              name: element['name'],
              selected: false
            })
          )          
        });
      }
    )    
  }

  getTipoConstruccion() {

    this.tipoConstruccionArr = this.docForm.get('tipo_construccion') as FormArray;

    this.listaSrv.getTipoConstruccion().subscribe(
      (res: []) => {
        res.forEach( (element, index) => {
          this.tipoConstruccionArr.push(
            this.formBuilder.group({
              code : element['code'],
              name: element['name'],
              selected: false
            })
          )          
        });
      }
    )
  }

  showCamera() {
    this.photosArr = this.docForm.get('photos') as FormArray;

    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType: this.camera.PictureSourceType.CAMERA
    }
    
    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      // let base64Image = 'data:image/jpeg;base64,' + imageData;
      //  console.log( base64Image )
      const img = window.Ionic.WebView.convertFileSrc(imageData);
      this.tmpImages.push( img );
      // this.photosArr.push( 
      //   this.formBuilder.group({
      //     photo: base64Image,
      //   }) 
      // );
      console.log(img);
    }, (err) => {
      console.log(err)
    });
  }

  activeCheckTipoConstruccion( event: any, i: number ) {

    this.tipoConstruccionArr.controls.forEach( ( e, i ) => {
      const data = this.tipoConstruccionArr.controls[i] as FormGroup;
      data.controls.selected.setValue( false );
    });
    const data = this.tipoConstruccionArr.controls[i] as FormGroup;
    const value = data.controls.selected.value;
    data.controls.selected.setValue( !value );
  }

  activeCheckTipoEducacion( event: any, i: number ) {

    this.tipoEducacionArr.controls.forEach( ( e, i ) => {
      const data = this.tipoEducacionArr.controls[i] as FormGroup;
      data.controls.selected.setValue( false );
    });

    const data = this.tipoEducacionArr.controls[i] as FormGroup;
    const value = data.controls.selected.value;
    data.controls.selected.setValue( !value );
  }

  activeCheckTipoAmenazasGenerales( event: any, i: number, x: any ) {
    const data = this.tipoAmenazaGeneralArr.controls[i] as FormGroup;
    data.controls.options.value.forEach( (element, index) => {
      data.controls.options.value[index].selected = false;
    });
    const value = data.controls.options.value[x].selected;
    data.controls.options.value[x].selected = !value;
  }

  activeCheckTipoAmenazaEstructural( event: any, i: number, x: any ) {
    const data = this.tipoAmenazaEstructuralesArr.controls[i] as FormGroup;
    data.controls.options.value.forEach( (element, index) => {
      data.controls.options.value[index].selected = false;
    });
    const value = data.controls.options.value[x].selected;
    data.controls.options.value[x].selected = !value;
  }

  activeCheckTipoAmenazaNoEstructural( event: any, i: number, x: any ) {
    const data = this.tipoAmenazaNoEstructuralesArr.controls[i] as FormGroup;
    data.controls.options.value.forEach( (element, index) => {
      data.controls.options.value[index].selected = false;
    });
    const value = data.controls.options.value[x].selected;
    data.controls.options.value[x].selected = !value;
  }

  activeCheckTipoAmenazaGeotecnica( event: any, i: number, x: any ) {
    const data = this.tipoAmenazaGeotecnicasArr.controls[i] as FormGroup;
    data.controls.options.value.forEach( (element, index) => {
      data.controls.options.value[index].selected = false;
    });
    const value = data.controls.options.value[x].selected;
    data.controls.options.value[x].selected = !value;
  }

  activeCheckTipoEstimacionDanio( event: any, i: number ) {
    this.tipoEstimacionDanioArr.controls.forEach( ( e, i ) => {
      const data = this.tipoEstimacionDanioArr.controls[i] as FormGroup;
      data.controls.selected.setValue( false );
    });

    const data = this.tipoEstimacionDanioArr.controls[i] as FormGroup;
    const value = data.controls.selected.value;
    data.controls.selected.setValue( !value );
  }

  activeCheckTipoMarcacion( event: any, i: number ) {
    this.tipoMarcacionArr.controls.forEach( ( e, i ) => {
      const data = this.tipoMarcacionArr.controls[i] as FormGroup;
      data.controls.selected.setValue( false );
    });
    const data = this.tipoMarcacionArr.controls[i] as FormGroup;
    const value = data.controls.selected.value;
    data.controls.selected.setValue( !value );
  }

  activeCheckTipoPancarta( event: any, i: number ) {
    this.tipoPancartaArr.controls.forEach( ( e, i ) => {
      const data = this.tipoPancartaArr.controls[i] as FormGroup;
      data.controls.selected.setValue( false );
    });
    const data = this.tipoPancartaArr.controls[i] as FormGroup;
    const value = data.controls.selected.value;
    data.controls.selected.setValue( !value );
  }

  activeCheckTipoMedidas( event: any, i: number ) {
    this.tipoMedidasArr.controls.forEach( ( e, i ) => {
      const data = this.tipoMedidasArr.controls[i] as FormGroup;
      data.controls.selected.setValue( false );
    });
    const data = this.tipoMedidasArr.controls[i] as FormGroup;
    const value = data.controls.selected.value;
    data.controls.selected.setValue( !value );
  }

  save() {
    this.nativeStorage.getItem('user').then( (res: any) => {
      let user = Number ( res.id );
      
      this.docForm.get('coordinates').patchValue(this.COORDENADAS);
      this.docForm.get('photos').patchValue( this.tmpImages )
      if ( this.id ) {
        this.docSrv.update( this.docForm.value, Number( this.id ) )
      } else {
        this.docSrv.post( this.docForm.value, user );
      }
    });

  }
  
  ionViewDidEnter() {
    // const id = this.route.snapshot.paramMap.get('id');
    this.id = this.route.snapshot.paramMap.get('id');
    if ( this.id ) {
      this.docSrv.edit( Number( this.id ) )
      .then( res => {
        if ( res ) {
          this.setData( res[0] );
        }
      });
  
      this.docSrv.editDetails( Number( this.id ) )
      .then( res => {
        if ( res ) {
          this.setDataDetails( res );
        }
      })

      this.tmpImages = []

      this.docSrv.editPhotos( Number( this.id ) )
      .then( (res: any) => {
        if ( res ) {
          res.forEach( (element: any) => {
            this.tmpImages.push( element.photo_local )
          });
        }
      })
    }
  }

  setDataDetails( res: any ) {
    
    let tipo_construccion = res.filter( res => res.type_lista === 'TIPO_CONSTRUCCION' );
    let tipo_educacion = res.filter( res => res.type_lista === 'TIPO_EDUCACION' );
    let estimacion_danios = res.filter( res => res.type_lista === 'ESTIMACION_DANIO' );
    let marcacion = res.filter( res => res.type_lista === 'MARCACION' );
    let pancarta = res.filter( res => res.type_lista === 'PANCARTA' );
    let medidas = res.filter( res => res.type_lista === 'TIPO_MEDIDAS' );

    let amenaza_general = res.filter( res => res.type_lista === 'AMENAZA_GENERAL' );
    let amenaza_estructural = res.filter( res => res.type_lista === 'AMENAZA_ESTRUCTURAL' );
    let amenaza_no_estructural = res.filter( res => res.type_lista === 'AMENAZA_NO_ESTRUCTURAL' );
    let amenaza_geotecnica = res.filter( res => res.type_lista === 'AMENAZA_GEOTECNICA' );

    if ( tipo_construccion ) {
      let selected_construccion = this.getTiposSelected( tipo_construccion )
      this.dateSelected.selected_construccion = selected_construccion;
    }

    if ( tipo_educacion ) {
      let selected_educacion = this.getTiposSelected( tipo_educacion )
      this.dateSelected.selected_educacion = selected_educacion;
    }

    if ( estimacion_danios ) {
      let selected_estimacion_danio = this.getTiposSelected( estimacion_danios )
      this.dateSelected.selected_estimacion_danio = selected_estimacion_danio;
    }
    if ( marcacion ) {
      let selected_marcacion = this.getTiposSelected( marcacion )
      this.dateSelected.selected_marcacion = selected_marcacion;
    }
    if ( pancarta ) {
      let selected_pancarta = this.getTiposSelected( pancarta )
      this.dateSelected.selected_pancarta = selected_pancarta;
    }
    if ( medidas ) {
      let selected_medidas = this.getTiposSelected( medidas )
      this.dateSelected.selected_medidas = selected_medidas;
      this.dateSelected.medidas = medidas
    }

    this.dateSelected.amenaza_general = amenaza_general
    this.dateSelected.amenaza_estructural = amenaza_estructural
    this.dateSelected.amenaza_no_estructural = amenaza_no_estructural
    this.dateSelected.amenaza_geotecnica = amenaza_geotecnica
  }

  setData(res: any) {
    this.docForm.patchValue({
      nombre_edificacion        : res.nombre_edificacion,
      direccion_edificacion     : res.direccion_edificacion,
      numero_contacto           : res.numero_contacto,
      pisos_sobre_suelo         : res.pisos_sobre_suelo,
      subsuelos                 : res.subsuelos,
      area_en_planta            : res.area_en_planta,
      residencia_habitada       : res.residencia_habitada,
      residencia_no_habitada    : res.residencia_no_habitada,
      observation_amenaza_gen   : res.observation_amenaza_gen,
      observation_amenaza_est   : res.observation_amenaza_est,
      observation_amenaza_no_est: res.observation_amenaza_no_est,
      observation_amenaza_geo   : res.observation_amenaza_geo,
      observation_marcacion     : res.observation_marcacion,
      observation_medidas       : res.observation_medidas
    });
  }

  getTiposSelected( data: any) {
    let value = data.filter( res => res.value )[0];
    return value ? value.code_lista : '';
  }

  getSelectedAmenazaGeneral( data: any ) {
    let res = '';
    if ( this.dateSelected.amenaza_general ) {
      let value = this.dateSelected.amenaza_general.filter( res => data.controls.code.value === res.code_lista )[0];

      if ( value.little ){
        res = 'poca';
      } else if ( value.moderate ) {
        res = 'moderada'
      } else if ( value.severe ) {
        res = 'severa'
      }
    }

    return res;
  }

  getSelectedAmenazaEstructural( data: any ) {
    let res = '';
    if ( this.dateSelected.amenaza_estructural ) {
      let value = this.dateSelected.amenaza_estructural.filter( res => data.controls.code.value === res.code_lista )[0];

      if ( value.little ){
        res = 'poca';
      } else if ( value.moderate ) {
        res = 'moderada'
      } else if ( value.severe ) {
        res = 'severa'
      }
    }

    return res;
  }

  getSelectedAmenazaNoEstructural( data: any ) {
    let res = '';
    if ( this.dateSelected.amenaza_no_estructural ) {
      let value = this.dateSelected.amenaza_no_estructural.filter( res => data.controls.code.value === res.code_lista )[0];

      if ( value.little ){
        res = 'poca';
      } else if ( value.moderate ) {
        res = 'moderada'
      } else if ( value.severe ) {
        res = 'severa'
      }
    }

    return res;
  }

  getSelectedAmenazaGeotecnica( data: any ) {
    let res = '';
    if ( this.dateSelected.amenaza_geotecnica ) {
      let value = this.dateSelected.amenaza_geotecnica.filter( res => data.controls.code.value === res.code_lista )[0];

      if ( value.little ){
        res = 'poca';
      } else if ( value.moderate ) {
        res = 'moderada'
      } else if ( value.severe ) {
        res = 'severa'
      }
    }

    return res;
  }

  getObservationMedidas( data: any ) {
    let observation = '';
    if ( this.dateSelected.medidas ) {
      let value = this.dateSelected.medidas.filter( res => data.controls.code.value === res.code_lista )[0];
      observation = value.observation;
    }

    return observation;
  }

  getCoorNew() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.COORDENADAS = { latitude: resp.coords.latitude, longitude : resp.coords.longitude  }
     }).catch((error) => {
       console.log('Error getting location', error);
     });
  }

}
