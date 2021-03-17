import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from "@angular/router";
import { Observable } from "rxjs";
import { ApiEndpointService } from "../service/api-endpoint.service";

@Injectable({
  providedIn: "root",
})
export class DropboxGuard implements CanActivate {
  constructor(
    private readonly apiEndpointSrv: ApiEndpointService,
    private readonly router: Router
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const dropboxAuthCheck: boolean = this.apiEndpointSrv.authenticateDropboxUser();
    if (!dropboxAuthCheck) {
      this.router.navigate(["/"]);
    }
    return dropboxAuthCheck;
  }
}
