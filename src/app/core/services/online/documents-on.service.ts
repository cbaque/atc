import { Injectable } from '@angular/core';
import { EnvService } from '../env.service';

@Injectable({
  providedIn: 'root'
})
export class DocumentsOnService {

  constructor(
    private DataServ: EnvService
  ) { }


  public post(data: any) {
    return this.DataServ.postQuery<any>(`documents`, data);
  }  

  public postOffice(data: any) {
    return this.DataServ.postQuery<any>(`documents/office`, data);
  } 
}
