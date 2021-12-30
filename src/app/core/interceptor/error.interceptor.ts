import { Injectable, Injector } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    // private authenticationService: AuthService
    // ,private mensajeSrv: MensajeService
    private injector: Injector
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    // var snackBar = this.injector.get(MatSnackBar);

    return next.handle(request).pipe(
      catchError((err) => {
        console.log(err)
        if (err.status === 401) {
          // auto logout if 401 response returned from api
          // this.authenticationService.logout();
          location.reload();
        }

        if (err.status === 500) {
          console.log(err.error.message)
          // this.mensajeSrv.isLoading.next( false );
          // snackBar.open(err.error.message, '', { duration: 6000, panelClass: 'snackbar-danger' });
        }        

        const error = err.error.message || err.statusText;
        return throwError(error);
      })
    );
  }
}
