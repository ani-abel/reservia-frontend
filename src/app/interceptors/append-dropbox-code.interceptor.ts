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
export class AppendDropboxCodeInterceptor implements HttpInterceptor {
  constructor(private readonly apiEndpointSrv: ApiEndpointService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    try {
      if (/dropbox/.test(req.url)) {
        const dropboxToken: any = this.apiEndpointSrv.getDropboxAuthTokenFromLocalStorage();
        if (dropboxToken) {
          const authReq = req.clone({
            headers: new HttpHeaders({
              DropboxAuthCode: JSON.stringify(dropboxToken),
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
