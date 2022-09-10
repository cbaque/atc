import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { ListasOficinaService } from 'src/app/core/services/listas/listas-oficina.service';
declare var window: any;
@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit {

  docForm                       : FormGroup;
  tmpImages                     : string[] = []; 
  tipoOcupacionArr              : FormArray;
  riesgoGeologicoArr            : FormArray;
  adyacenciaArr                 : FormArray;
  irregularidadesArr            : FormArray;
  caidaExteriorArr              : FormArray;
  tipologiaEstructuralArr       : FormArray;
  otrosRiesgosArr               : FormArray;
  accionRequeridaEArr           : FormArray;
  accionRequeridaNEArr          : FormArray;
  dateSelected;
  loading                       : boolean = false;
  
  constructor(
    private formBuilder: FormBuilder,
    private camera: Camera,
    private listaSrv: ListasOficinaService
  ) {
    this.dateSelected = {};

    this.docForm = this.createForm();
    this.getOcupacion();
    this.getRiesgoGeologico();
    this.getAdyacencia();
    this.getIrregularidad();
    this.getCaidaExterior();
    this.getTipologiaEstructural();
    this.getOtrosRiesgos();
    this.getAccionRequeridaE();
    this.getAccionRequeridaNE();
   }

  ngOnInit() {
    
  }

  createForm() {
    return this.formBuilder.group({
      nombre_edificacion              : [ '', Validators.required ],
      direccion_edificacion           : [ '' ],
      codigo_castratal                : [ '' ],
      anio_construccion_edificacion   : [ '' ],
      anio_remodelacion_edificacion   : [ '' ],
      anio_normativa                  : [ '' ],
      photos                          : new FormControl( '' ),
      piso_subsuelo                   : [ '' ],
      piso_bajo_subsuelo              : [ '' ],
      piso_area_construccion          : [ '' ],
      piso_adiciones                  : [ '' ],
      tipo_ocupacion                  : this.formBuilder.array([]),
      riesgo_geologico                : this.formBuilder.array([]),
      adyacencia                      : this.formBuilder.array([]),
      irregularidad                   : this.formBuilder.array([]),
      caida_exterior                  : this.formBuilder.array([]),
      tipologia_estructural           : this.formBuilder.array([]),
      otros_riesgos                   : this.formBuilder.array([]),
      accion_requerida_e             : this.formBuilder.array([]),
      accion_requerida_ne            : this.formBuilder.array([]),
    });
  }

  showCamera() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType: this.camera.PictureSourceType.CAMERA
    }
    
    this.camera.getPicture(options).then((imageData) => {
      const img = window.Ionic.WebView.convertFileSrc(imageData);
      this.tmpImages.push( img );
      // this.tmpImagesSrv.push( imageData );
      // console.log(img);
    }, (err) => {
      console.log(err)
    });
  }

  getOcupacion() {
    this.tipoOcupacionArr = this.docForm.get('tipo_ocupacion') as FormArray;
    this.listaSrv.getTipoOcupacion().subscribe(
      (res: []) => {
        res.forEach( (element, index) => {
          this.tipoOcupacionArr.push(
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

  activeCheckTipoOcupacion( event: any, i: number ) {
    this.tipoOcupacionArr.controls.forEach( ( e, i ) => {
      const data = this.tipoOcupacionArr.controls[i] as FormGroup;
      data.controls.selected.setValue( false );
    });
    const data = this.tipoOcupacionArr.controls[i] as FormGroup;
    const value = data.controls.selected.value;
    data.controls.selected.setValue( !value );
  }

  getRiesgoGeologico() {
    this.riesgoGeologicoArr = this.docForm.get('riesgo_geologico') as FormArray;
    this.listaSrv.getRiesgoGeologico().subscribe(
      (res: []) => {
        res.forEach( (element, index) => {
          let datatmp = [];
          datatmp.push( element['options'] )
          this.riesgoGeologicoArr.push(
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

  getSelectedRiesgoGeologico( data: any ) {
    let res = '';
    if ( this.dateSelected.riesgo_geologico ) {
      let value = this.dateSelected.riesgo_geologico.filter( res => data.controls.code.value === res.code_lista )[0];

      if ( value.si ){
        res = 'si';
      } else if ( value.no ) {
        res = 'no'
      } else if ( value.dnk ) {
        res = 'dnk'
      }
    }

    return res;
  }

  activeCheckRiesgoGeologico( event: any, i: number, x: any ) {
    const data = this.riesgoGeologicoArr.controls[i] as FormGroup;
    data.controls.options.value.forEach( (element, index) => {
      data.controls.options.value[index].selected = false;
    });
    const value = data.controls.options.value[x].selected;
    data.controls.options.value[x].selected = !value;
  }

  getAdyacencia() {
    this.adyacenciaArr = this.docForm.get('adyacencia') as FormArray;
    this.listaSrv.getAdyacencia().subscribe(
      (res: []) => {
        res.forEach( (element, index) => {
          let datatmp = [];
          datatmp.push( element['options'] )
          this.adyacenciaArr.push(
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

  getSelectedAdyacencia( data: any ) {
    let res = '';
    if ( this.dateSelected.adyacencia ) {
      let value = this.dateSelected.adyacencia.filter( res => data.controls.code.value === res.code_lista )[0];

      if ( value.si ){
        res = 'si';
      } else if ( value.no ) {
        res = 'no'
      } else if ( value.dnk ) {
        res = 'dnk'
      }
    }

    return res;
  }

  activeCheckAdyacencia( event: any, i: number, x: any ) {
    const data = this.adyacenciaArr.controls[i] as FormGroup;
    data.controls.options.value.forEach( (element, index) => {
      data.controls.options.value[index].selected = false;
    });
    const value = data.controls.options.value[x].selected;
    data.controls.options.value[x].selected = !value;
  }

  getIrregularidad() {
    this.irregularidadesArr = this.docForm.get('irregularidad') as FormArray;
    this.listaSrv.getIrregularidades().subscribe(
      (res: []) => {
        res.forEach( (element, index) => {
          let datatmp = [];
          datatmp.push( element['options'] )
          this.irregularidadesArr.push(
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

  getSelectedIrregularidad( data: any ) {
    let res = '';
    if ( this.dateSelected.irregularidad ) {
      let value = this.dateSelected.irregularidad.filter( res => data.controls.code.value === res.code_lista )[0];

      if ( value.si ){
        res = 'si';
      } else if ( value.no ) {
        res = 'no'
      } else if ( value.dnk ) {
        res = 'dnk'
      }
    }

    return res;
  }

  activeCheckIrregularidad( event: any, i: number, x: any ) {
    const data = this.irregularidadesArr.controls[i] as FormGroup;
    data.controls.options.value.forEach( (element, index) => {
      data.controls.options.value[index].selected = false;
    });
    const value = data.controls.options.value[x].selected;
    data.controls.options.value[x].selected = !value;
  }

  getCaidaExterior() {
    this.caidaExteriorArr = this.docForm.get('caida_exterior') as FormArray;
    this.listaSrv.getCaidaExteriores().subscribe(
      (res: []) => {
        res.forEach( (element, index) => {
          let datatmp = [];
          datatmp.push( element['options'] )
          this.caidaExteriorArr.push(
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

  getSelectedCaidaExterior( data: any ) {
    let res = '';
    if ( this.dateSelected.caida_exterior ) {
      let value = this.dateSelected.caida_exterior.filter( res => data.controls.code.value === res.code_lista )[0];

      if ( value.si ){
        res = 'si';
      } else if ( value.no ) {
        res = 'no'
      } else if ( value.dnk ) {
        res = 'dnk'
      }
    }

    return res;
  }

  activeCheckCaidaExterior( event: any, i: number, x: any ) {
    const data = this.caidaExteriorArr.controls[i] as FormGroup;
    data.controls.options.value.forEach( (element, index) => {
      data.controls.options.value[index].selected = false;
    });
    const value = data.controls.options.value[x].selected;
    data.controls.options.value[x].selected = !value;
  }  


  getTipologiaEstructural() {
    this.tipologiaEstructuralArr = this.docForm.get('tipologia_estructural') as FormArray;
    this.listaSrv.getTipologiaSistemaEstructural().subscribe(
      (res: []) => {
        res.forEach( (element, index) => {
          this.tipologiaEstructuralArr.push(
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

  activeCheckTipologiaEstructural( event: any, i: number ) {
    this.tipologiaEstructuralArr.controls.forEach( ( e, i ) => {
      const data = this.tipologiaEstructuralArr.controls[i] as FormGroup;
      data.controls.selected.setValue( false );
    });
    const data = this.tipologiaEstructuralArr.controls[i] as FormGroup;
    const value = data.controls.selected.value;
    data.controls.selected.setValue( !value );
  }

  getOtrosRiesgos() {
    this.otrosRiesgosArr = this.docForm.get('otros_riesgos') as FormArray;
    this.listaSrv.getOtrosRiesgos().subscribe(
      (res: []) => {
        res.forEach( (element, index) => {
          this.otrosRiesgosArr.push(
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

  activeCheckOtrosRiesgos( event: any, i: number ) {
    this.otrosRiesgosArr.controls.forEach( ( e, i ) => {
      const data = this.otrosRiesgosArr.controls[i] as FormGroup;
      data.controls.selected.setValue( false );
    });
    const data = this.otrosRiesgosArr.controls[i] as FormGroup;
    const value = data.controls.selected.value;
    data.controls.selected.setValue( !value );
  }


  getAccionRequeridaE() {
    
    this.accionRequeridaEArr = this.docForm.get('accion_requerida_e') as FormArray;
    this.listaSrv.getAccionRequeridaE().subscribe(
      (res: []) => {
        debugger
        res.forEach( (element, index) => {
          this.accionRequeridaEArr.push(
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

  activeCheckAccionRequeridaE( event: any, i: number ) {
    this.accionRequeridaEArr.controls.forEach( ( e, i ) => {
      const data = this.accionRequeridaEArr.controls[i] as FormGroup;
      data.controls.selected.setValue( false );
    });
    const data = this.accionRequeridaEArr.controls[i] as FormGroup;
    const value = data.controls.selected.value;
    data.controls.selected.setValue( !value );
  }

  getAccionRequeridaNE() {
    this.accionRequeridaNEArr = this.docForm.get('accion_requerida_ne') as FormArray;
    this.listaSrv.getAccionRequeridaNE().subscribe(
      (res: []) => {
        res.forEach( (element, index) => {
          this.accionRequeridaNEArr.push(
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

  activeCheckAccionRequeridaNE( event: any, i: number ) {
    this.accionRequeridaNEArr.controls.forEach( ( e, i ) => {
      const data = this.accionRequeridaNEArr.controls[i] as FormGroup;
      data.controls.selected.setValue( false );
    });
    const data = this.accionRequeridaNEArr.controls[i] as FormGroup;
    const value = data.controls.selected.value;
    data.controls.selected.setValue( !value );
  }  
  
  save() {}

}
