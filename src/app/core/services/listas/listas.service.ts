import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ListasService {

  constructor(
    private http: HttpClient,
  ) { }


  getTipoConstruccion() {
    return this.http.get<any[]>('/assets/fake/tipo_construccion.json');
  }

  getTipoEducacion() {
    return this.http.get<any[]>('/assets/fake/tipo_educacion.json');
  }

  getTipoAmenazaGeneral() {
    return this.http.get<any[]>('/assets/fake/amenazas_generales.json');
  }

  getTipoAmenazaEstructurales() {
    return this.http.get<any[]>('/assets/fake/amenazas_estructurales.json');
  }

  getTipoAmenazaNoEstructurales() {
    return this.http.get<any[]>('/assets/fake/amenazas_no_estructurales.json');
  }

  getTipoAmenazaGeotecnicas() {
    return this.http.get<any[]>('/assets/fake/geotecnicas.json');
  }

  getTipoEstimacionDanios() {
    return this.http.get<any[]>('/assets/fake/estimacion_danios.json');
  }

  getTipoMarcacion() {
    return this.http.get<any[]>('/assets/fake/marcacion.json');
  }

  getTipoPancarta() {
    return this.http.get<any[]>('/assets/fake/pancarta.json');
  } 
  
  getTipoMedidas() {
    return this.http.get<any[]>('/assets/fake/medidas.json');
  }
}
