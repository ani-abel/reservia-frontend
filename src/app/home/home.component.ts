import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { map } from "rxjs/operators";
import { SubSink } from "subsink";
import {
  AuthorizationQueryUrlData,
  CloudProvider,
  LocalStorageKey,
} from "../types/data.types";
import { ApiEndpointService } from "../service/api-endpoint.service";

@Component({
  selector: "app-home",
  template: `
    <main [ngClass]="['container']">
      <section [ngClass]="['login-container']">
        <h2
          [ngClass]="['text-center', 'no-margin', 'app-title', 'index-title']"
        >
          <span><i [ngClass]="['fa', 'fa-server']"></i></span>RESERVIA
        </h2>
        <div [ngClass]="['button-section', 'text-center']">
          <button
            [ngClass]="['btn', 'btn-danger']"
            (click)="navigateUser('DROPBOX')"
          >
            <i [ngClass]="['fa', 'fa-dropbox']"></i> DROPBOX
          </button>
          <p [ngClass]="['caption-paragraph']">OR</p>
          <button
            [ngClass]="['btn', 'btn-primary']"
            (click)="navigateUser('GOOGLE')"
          >
            <i [ngClass]="['fa', 'fa-google']"></i> GOOGLE DRIVE
          </button>
        </div>
      </section>
    </main>

    <footer [ngClass]="['text-center', 'normal-footer']">
      <a [routerLink]="['/privacy-policy']">PRIVACY POLICY</a>
    </footer>
  `,
  styles: [],
})
export class HomeComponent implements OnInit, OnDestroy {
  userDetails: any;
  subSink: SubSink = new SubSink();

  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly apiEndpointSrv: ApiEndpointService
  ) {}

  ngOnInit(): void {
    this.subSink.sink = this.activatedRoute.queryParams
      .pipe(
        map((res) => {
          return {
            Provider: res.provider,
            Code: res.code,
          };
        })
      )
      .subscribe((res: AuthorizationQueryUrlData) => {
        if (res) {
          const provider: string = res.Provider?.toUpperCase();
          if (provider === CloudProvider.DROPBOX) {
            this.apiEndpointSrv.setToLocalStorage(
              LocalStorageKey.DropboxAuthToken,
              res.Code
            );
            this.router.navigate(["/dropbox-drive-dashboard"]);
            this.apiEndpointSrv.setAppProvider(CloudProvider.DROPBOX);
          }
          if (provider === CloudProvider.GOOGLE) {
            this.apiEndpointSrv.setToLocalStorage(
              LocalStorageKey.GoogleAuthToken,
              res.Code
            );
            this.apiEndpointSrv.setAppProvider(CloudProvider.GOOGLE);
            this.router.navigate(["/google-drive-dashboard"]);
          }
        }
      });
  }

  navigateUser(purpose: "GOOGLE" | "DROPBOX"): void {
    switch (purpose) {
      case CloudProvider.GOOGLE:
        //Try to get google token
        const googleToken: any = this.apiEndpointSrv.getGoogleAuthTokenFromLocalStorage();
        if (googleToken && this.apiEndpointSrv.authenticateGoogleUser()) {
          this.apiEndpointSrv.setAppProvider(CloudProvider.GOOGLE);
          this.router.navigate(["/google-drive-dashboard"]);
        } else {
          //Get authURL
          this.subSink.sink = this.apiEndpointSrv
            .authorizeGoogleDrive()
            .subscribe((res) => {
              location.href = res.AuthURL;
            });
        }
        break;
      case CloudProvider.DROPBOX:
        //Try to get google token
        const dropboxToken: any = this.apiEndpointSrv.getDropboxAuthTokenFromLocalStorage();
        if (dropboxToken) {
          this.apiEndpointSrv.setAppProvider(CloudProvider.DROPBOX);
          this.router.navigate(["/dropbox-drive-dashboard"]);
        } else {
          //Get authURL
          this.subSink.sink = this.apiEndpointSrv
            .authorizeDropboxDrive()
            .subscribe((res) => {
              location.href = res.AuthURL;
            });
        }
        break;
    }
  }

  ngOnDestroy(): void {
    this.subSink.unsubscribe();
  }
}
