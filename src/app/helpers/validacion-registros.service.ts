import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidacionRegistrosService {

  constructor() { }

  validationMessages = {
    username: [
      { type: 'required', message: 'CI de Inspector es obligatorio' },
      { type: 'pattern', message: 'Digite solo números' },
      { type: 'minlength', message: 'Mínimo 10 dígitos' },
    ],
    nombres: [
      { type: 'required', message: 'Nombres es obligatorio.' },
    ],
    password: [
      { type: 'required', message: 'Contraseña es obligatorio.' },
      { type: 'minlength', message: 'Mínimo 5 caracteres' },
    ]    
  };

}
