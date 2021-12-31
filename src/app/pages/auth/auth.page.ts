import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OffAuthService } from 'src/app/core/services/offline/auth/off-auth.service';
import { ValidacionRegistrosService } from 'src/app/helpers/validacion-registros.service';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { MessageService } from 'src/app/core/services/message.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  authForm: FormGroup;
  loading: boolean = false;

  constructor(
    private router: Router,
    private authOff: OffAuthService,
    private fb: FormBuilder,
    public validator: ValidacionRegistrosService,
    private nativeStorage: NativeStorage,
  ) {
  }

  ngOnInit() {
    this.authForm = this.createForm();
  }

  private createForm(){
    return this.fb.group({
      username        : [ '', [ Validators.required ] ],
      password        : [ '', [ Validators.required ] ],
    });
  }
  
  login(){  
    this.nativeStorage.clear();
    this.loading = true;
    this.authOff.get( this.authForm.value )
    .then( ( res ) => {
      if ( res ) {
        setTimeout(() => {
          this.loading = false;
          console.log(res)
          this.nativeStorage.setItem('user', res);
          this.router.navigate(["/main/tabs/tab1"]);
          
        }, 2000);
      }else {
        this.loading = false;
        alert('Credenciales incorrectas.')
      }
    });
  }

}
