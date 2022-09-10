import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ListasOficinaService {

  constructor(
    private http: HttpClient,
  ) { }

  getTipoOcupacion() {
    return this.http.get<any[]>('/assets/fake/tipo_ocupacion.json');
  } 
  
  getRiesgoGeologico() {
    return this.http.get<any[]>('/assets/fake/riesgo_geologicos.json');
  }  
  
  getAdyacencia() {
    return this.http.get<any[]>('/assets/fake/adyacencia.json');
  } 

  getIrregularidades() {
    return this.http.get<any[]>('/assets/fake/irregularidades.json');
  }   

  getCaidaExteriores() {
    return this.http.get<any[]>('/assets/fake/caidas_exteriores.json');
  } 
  
  getTipologiaSistemaEstructural() {
    return this.http.get<any[]>('/assets/fake/tipologia_sistema_estructural.json');
  } 

  getOtrosRiesgos() {
    return this.http.get<any[]>('/assets/fake/otros_riesgos.json');
  }     

  getAccionRequeridaE() {
    return this.http.get<any[]>('/assets/fake/accion_requerida_estructurada.json');
  }    
  
  getAccionRequeridaNE() {
    return this.http.get<any[]>('/assets/fake/accion_requerida_no_estructurada.json');
  }   


}
