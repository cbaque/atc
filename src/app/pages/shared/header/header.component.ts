import { Component, OnInit } from '@angular/core';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { OffAuthService } from 'src/app/core/services/offline/auth/off-auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  public user
  constructor(
    private nativeStorage: NativeStorage,
    private authOff: OffAuthService,
  ) { }

  ngOnInit() {
    this.nativeStorage.getItem('user').then( (res) => {
      console.log(res);
      this.user = res
    });
  }

  logout() {
    this.authOff.logout();
  }

}
