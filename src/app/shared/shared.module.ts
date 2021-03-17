import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { CloseModalsDirective } from "./close-modals.directive";
import { NavComponent } from "./nav/nav.component";
import { SidebarComponent } from "./sidebar/sidebar.component";
import { LogoSectionComponent } from "./logo-section/logo-section.component";
import { FolderWidgetComponent } from "./folder-widget/folder-widget.component";
import { FileWidgetComponent } from "./file-widget/file-widget.component";
import { FooterComponent } from "./footer/footer.component";
import { SearhModalComponent } from "./searh-modal/searh-modal.component";
import { NewFileModalComponent } from "./new-file-modal/new-file-modal.component";
import { NewFolderModalComponent } from "./new-folder-modal/new-folder-modal.component";
import { DiskStorageModalComponent } from "./disk-storage-modal/disk-storage-modal.component";
import { ErrorMessageModalComponent } from "./error-message-modal/error-message-modal.component";
import { SuccessMessageModalComponent } from "./success-message-modal/success-message-modal.component";
import { SearchedFileWidgetComponent } from "./searched-file-widget/searched-file-widget.component";
import { SearchedFolderWidgetComponent } from "./searched-folder-widget/searched-folder-widget.component";
import { ToggleSidebarDirective } from "./toggle-sidebar.directive";
import { OpenModalDirective } from "./open-modal.directive";
import { ToggleFileActionsDirective } from "./toggle-file-actions.directive";
import { NoContentFoundComponent } from "./no-content-found/no-content-found.component";
import { UploadedFilePreviewComponent } from "./uploaded-file-preview/uploaded-file-preview.component";
import { LoaderComponent } from "./loader/loader.component";
import { ShortenTextPipe } from "./shorten-text.pipe";

@NgModule({
  declarations: [
    CloseModalsDirective,
    NavComponent,
    SidebarComponent,
    LogoSectionComponent,
    FolderWidgetComponent,
    FileWidgetComponent,
    FooterComponent,
    SearhModalComponent,
    NewFileModalComponent,
    NewFolderModalComponent,
    DiskStorageModalComponent,
    ErrorMessageModalComponent,
    SuccessMessageModalComponent,
    SearchedFileWidgetComponent,
    SearchedFolderWidgetComponent,
    ToggleSidebarDirective,
    OpenModalDirective,
    ToggleFileActionsDirective,
    NoContentFoundComponent,
    UploadedFilePreviewComponent,
    LoaderComponent,
    ShortenTextPipe,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  exports: [
    CloseModalsDirective,
    NavComponent,
    SidebarComponent,
    LogoSectionComponent,
    FolderWidgetComponent,
    FileWidgetComponent,
    FooterComponent,
    SearhModalComponent,
    NewFileModalComponent,
    NewFolderModalComponent,
    DiskStorageModalComponent,
    ErrorMessageModalComponent,
    SuccessMessageModalComponent,
    UploadedFilePreviewComponent,
    LoaderComponent,
    ToggleSidebarDirective,
    OpenModalDirective,
    ToggleFileActionsDirective,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ShortenTextPipe,
    NoContentFoundComponent,
  ],
})
export class SharedModule {}
