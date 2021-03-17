import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { ServiceWorkerModule } from "@angular/service-worker";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HomeComponent } from "./home/home.component";
import { GoogleDriveDashboardComponent } from "./google-drive-dashboard/google-drive-dashboard.component";
import { SharedModule } from "./shared/shared.module";
import { NotFoundComponent } from "./not-found/not-found.component";
import { environment } from "../environments/environment";
import { DropboxDriveDashboardComponent } from "./dropbox-drive-dashboard/dropbox-drive-dashboard.component";
import { RequestTimeoutInterceptor } from "./interceptors/request-timeout.interceptor";
import { AppendGoogleCodeInterceptor } from "./interceptors/append-google-code.interceptor";
import { AppendDropboxCodeInterceptor } from "./interceptors/append-dropbox-code.interceptor";
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    GoogleDriveDashboardComponent,
    NotFoundComponent,
    DropboxDriveDashboardComponent,
    PrivacyPolicyComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    ServiceWorkerModule.register("ngsw-worker.js", {
      enabled: environment.production,
    }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestTimeoutInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AppendGoogleCodeInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AppendDropboxCodeInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
