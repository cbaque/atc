import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'src/app/core/services/message.service';
import { OffUserService } from 'src/app/core/services/offline/user/off-user.service';
import { ValidacionRegistrosService } from 'src/app/helpers/validacion-registros.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  singupForm: FormGroup;
  loading                       : boolean = false;
  constructor(
    private userOff: OffUserService,
    private fb: FormBuilder,
    public validator: ValidacionRegistrosService,
    private messageSrv: MessageService
  ){ 
    this.messageSrv.isLoading.subscribe( res => this.loading = res );
    this.singupForm = this.createForm();
  }

  ngOnInit() {
  }

  private createForm(){
    return this.fb.group({
      username        : [ '', [ Validators.required, Validators.minLength(10), Validators.pattern('^[0-9,$]*$') ] ],
      nombres         : [ '', [ Validators.required ] ],
      password        : [ '', [ Validators.required, Validators.minLength(5) ] ],
    });
  }


  public save(){
    this.userOff.post( this.singupForm.value );
  }



}
