import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy,
} from "@angular/core";
import { Observable } from "rxjs";
import { SubSink } from "subsink";
import { ApiEndpointService } from "../../service/api-endpoint.service";
import { CloudProvider, DropboxFileType } from "../../types/data.types";
import {
  DEFAULT_FILE_SIZE,
  DEFAULT_FILES_PER_UPLOAD,
} from "../../types/data.types";

@Component({
  selector: "app-new-file-modal",
  template: `
    <!-- Modal for creating and adding new Files(Begins) -->
    <div class="modal-container hide-element" id="new-file-modal">
      <div class="modal">
        <p class="modal-close no-margin text-right">
          <i
            class="fa fa-close cursor-pointer close-modal"
            (click)="closeModal()"
          ></i>
        </p>
        <h2 class="modal-title no-margin text-center">Upload File(s)</h2>
        <p class="modal-title-helper text-center no-margin">
          {{ currentFilePointerPath$ | async }}
        </p>
        <div class="modal-content">
          <form action="" enctype="multipart/form-data">
            <div class="form-group">
              <input
                type="file"
                name=""
                id="file-selector"
                multiple
                (change)="handleFiles()"
                #fileSelector
              />
              <button
                class="btn btn-danger"
                id="open-file-selector"
                (click)="fileSelector.click()"
              >
                <i class="fa fa-file-o"></i> Select File(s)
              </button>
            </div>

            <main *ngIf="uploadedFiles?.length > 0; else defaultTemplate">
              <div class="files-list-container form-group">
                <app-uploaded-file-preview
                  *ngFor="let file of uploadedFiles"
                  [file]="file"
                ></app-uploaded-file-preview>
              </div>
              <div class="form-group">
                <button
                  type="button"
                  class="btn btn-primary"
                  (click)="saveFile()"
                >
                  Upload
                </button>
              </div>
            </main>
            <ng-template #defaultTemplate>
              <br />
              <app-no-content-found></app-no-content-found>
            </ng-template>
          </form>
        </div>
      </div>
    </div>
    <!-- Modal for creating and adding new Files(Ends) -->
  `,
  styles: [],
})
export class NewFileModalComponent implements OnInit, OnDestroy {
  @ViewChild("fileSelector", { read: ElementRef }) fileSelector: ElementRef;
  currentFilePointerPath$: Observable<string>;
  uploadedFiles: File[];
  subSink: SubSink = new SubSink();

  constructor(private readonly apiEndpointSrv: ApiEndpointService) {}

  ngOnInit(): void {
    this.currentFilePointerPath$ = this.apiEndpointSrv.getFolderPointerLocationAsObs();
  }

  fileSizeCheck(file: File): string {
    //if > 50mb
    if (file.size > DEFAULT_FILE_SIZE) {
      return "This file is larger than 50mb";
    }
  }

  handleFiles(): void {
    const files: File[] = this.fileSelector.nativeElement.files;
    if (files?.length > DEFAULT_FILES_PER_UPLOAD) {
      this.apiEndpointSrv.displayErrorMessage(
        `Upload ${DEFAULT_FILES_PER_UPLOAD} files at a time`
      );
      return;
    }
    //Check file size
    for (const file of files) {
      const sizeCheck: string = this.fileSizeCheck(file);
      if (sizeCheck) {
        this.apiEndpointSrv.displayErrorMessage(sizeCheck);
        return;
      }
    }

    this.uploadedFiles = [...files];
  }

  saveFile(): void {
    if (this.uploadedFiles?.length < 1) {
      return;
    }

    this.subSink.sink = this.apiEndpointSrv
      .getAppProviderAsObs()
      .subscribe((response: CloudProvider) => {
        if (response === CloudProvider.DROPBOX) {
          //If dropbox
          this.subSink.sink = this.apiEndpointSrv
            .saveFilesToDropbox(this.uploadedFiles)
            .subscribe(
              (response: any) => {
                if (Array.isArray(response)) {
                  this.uploadedFiles = null;
                  this.apiEndpointSrv.displaySuccessMessage(
                    `${response.length} files uploaded`
                  );
                  //Remember to inform the APP that repeated requests can now resume
                  this.apiEndpointSrv.setIsUploadHappening(false);

                  const newFiles: DropboxFileType[] = response.map((file) => {
                    return {
                      Id: file.id,
                      Name: file.name,
                      Tag: "file",
                      Path: file.path_lower,
                    };
                  });
                  //Add the new Folder to list of assets to be displayed
                  const allFiles: DropboxFileType[] = this.apiEndpointSrv.getFileListOnPathAsLiteral();
                  allFiles.push(...newFiles);
                  this.apiEndpointSrv.setFileListOnPath(allFiles);
                }
              },
              (error: any) => {
                this.apiEndpointSrv.setIsUploadHappening(false);
                this.apiEndpointSrv.displayErrorMessage("Upload failed");
                throw error;
              }
            );
        }
        if (response === CloudProvider.GOOGLE) {
          //Use Google
          this.subSink.sink = this.apiEndpointSrv
            .saveFilesToGoogle(this.uploadedFiles)
            .subscribe(
              (response) => {
                if (Array.isArray(response)) {
                  this.uploadedFiles = null;
                  this.apiEndpointSrv.displaySuccessMessage(
                    `${response.length} files uploaded`
                  );
                  //Remember to inform the APP that repeated requests can now resume
                  this.apiEndpointSrv.setIsUploadHappening(false);

                  const newFiles: DropboxFileType[] = response.map((file) => {
                    return {
                      Id: file.id,
                      Name: file.name,
                      Tag: "file",
                      Path: file.parents[0],
                    };
                  });
                  //Add the new Folder to list of assets to be displayed
                  const allFiles: DropboxFileType[] = this.apiEndpointSrv.getFileListOnPathAsLiteral();
                  allFiles.push(...newFiles);
                  this.apiEndpointSrv.setFileListOnPath(allFiles);
                }
              },
              (error: any) => {
                this.apiEndpointSrv.setIsUploadHappening(false);
                this.apiEndpointSrv.displayErrorMessage("Upload failed");
                throw error;
              }
            );
        }
      });
  }

  closeModal(): void {
    const newFileModal: HTMLElement = document.querySelector("#new-file-modal");
    newFileModal.classList.remove("show-element");
    newFileModal.classList.add("hide-element");
  }

  ngOnDestroy(): void {
    this.subSink.unsubscribe();
  }
}
