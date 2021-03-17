import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpHeaders,
} from "@angular/common/http";
import { Observable } from "rxjs";
import { ApiEndpointService } from "../service/api-endpoint.service";

@Injectable()
export class AppendGoogleCodeInterceptor implements HttpInterceptor {
  constructor(private readonly apiEndpointSrv: ApiEndpointService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    try {
      if (/google/.test(req.url)) {
        const googleToken: any = this.apiEndpointSrv.getGoogleAuthTokenFromLocalStorage();
        if (googleToken) {
          const authReq = req.clone({
            headers: new HttpHeaders({
              GoogleAuthCode: JSON.stringify(googleToken),
            }),
          });

          return next.handle(authReq);
        }
      }
      return next.handle(req);
    } catch (ex) {
      throw ex;
    }
  }
}
