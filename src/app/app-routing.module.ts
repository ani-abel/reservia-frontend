import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { GoogleDriveDashboardComponent } from "./google-drive-dashboard/google-drive-dashboard.component";
import { DropboxDriveDashboardComponent } from "./dropbox-drive-dashboard/dropbox-drive-dashboard.component";
import { PrivacyPolicyComponent } from "./privacy-policy/privacy-policy.component";
import { NotFoundComponent } from "./not-found/not-found.component";
import { GoogleGuard } from "./auth/google-guard.guard";
import { DropboxGuard } from "./auth/dropbox-guard.guard";

const appRoutes: Routes = [
  { path: "", pathMatch: "full", redirectTo: "home" },
  { path: "home", component: HomeComponent },
  {
    path: "privacy-policy",
    component: PrivacyPolicyComponent,
  },
  {
    path: "google-drive-dashboard",
    component: GoogleDriveDashboardComponent,
    canActivate: [GoogleGuard],
  },
  {
    path: "dropbox-drive-dashboard",
    component: DropboxDriveDashboardComponent,
    canActivate: [DropboxGuard],
  },
  { path: "**", component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
