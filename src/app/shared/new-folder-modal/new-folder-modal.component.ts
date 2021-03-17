import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { SubSink } from "subsink";
import { Observable } from "rxjs";
import { ApiEndpointService } from "../../service/api-endpoint.service";
import { CloudProvider, DropboxFileType } from "../../types/data.types";

@Component({
  selector: "app-new-folder-modal",
  template: `
    <!-- Modal for creating and adding new Folders (Begins) -->
    <div class="modal-container hide-element" id="new-folder-modal">
      <div class="modal">
        <p class="modal-close no-margin text-right">
          <i
            class="fa fa-close cursor-pointer close-modal"
            id="close-new-folder-modal"
            (click)="closeNewFolderModal()"
          ></i>
        </p>
        <h2 class="modal-title no-margin text-center">Create Folder</h2>
        <p class="modal-title-helper text-center no-margin">
          {{ currentFilePointerPath$ | async }}
        </p>
        <div class="modal-content">
          <form [formGroup]="folderCreationForm" (ngSubmit)="submitForm()">
            <div class="form-group">
              <input
                [formControlName]="'folderName'"
                type="text"
                class="form-control"
                placeholder="Folder Name"
              />
            </div>
            <div class="form-group">
              <button type="submit" class="btn btn-primary">Create</button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <!-- Modal for creating and adding new Folders (Ends) -->
  `,
  styles: [],
})
export class NewFolderModalComponent implements OnInit, OnDestroy {
  folderCreationForm: FormGroup;
  currentFilePointerPath$: Observable<string>;
  subSink: SubSink = new SubSink();

  constructor(private readonly apiEndpointSrv: ApiEndpointService) {}

  ngOnInit(): void {
    this.initForm();
    this.currentFilePointerPath$ = this.apiEndpointSrv.getFolderPointerLocationAsObs();
  }

  initForm(): void {
    this.folderCreationForm = new FormGroup({
      folderName: new FormControl(null, Validators.required),
    });
  }

  submitForm(): void {
    try {
      if (this.folderCreationForm.invalid) {
        return;
      }
      const { folderName } = this.folderCreationForm.value;
      this.subSink.sink = this.apiEndpointSrv
        .getAppProviderAsObs()
        .subscribe((response: CloudProvider) => {
          console.log(response);
          if (response === CloudProvider.DROPBOX) {
            //It's Dropbox
            this.subSink.sink = this.apiEndpointSrv
              .createDropboxFolder(folderName)
              .subscribe((response: any) => {
                if ("id" in response.metadata) {
                  const message: string = `Folder created on '${response.metadata.path_lower}'`;
                  this.apiEndpointSrv.displaySuccessMessage(message);
                  this.folderCreationForm.reset();

                  const { id, name, path_lower } = response.metadata;
                  const newFolder: DropboxFileType = {
                    Id: id,
                    Name: name,
                    Tag: "folder",
                    Path: path_lower,
                  };

                  //Add the new Folder to list of assets to be displayed
                  const allFiles: DropboxFileType[] = this.apiEndpointSrv.getFileListOnPathAsLiteral();
                  allFiles.push(newFolder);
                  this.apiEndpointSrv.setFileListOnPath(allFiles);
                }
              });
          }
          if (response === CloudProvider.GOOGLE) {
            //it's Google
            this.subSink.sink = this.apiEndpointSrv
              .createGoogleFolder(folderName)
              .subscribe((response) => {
                if ("kind" in response) {
                  const message: string = `Folder created`;
                  this.apiEndpointSrv.displaySuccessMessage(message);
                  this.folderCreationForm.reset();
                  const newFolder: DropboxFileType = {
                    Id: response.id,
                    Name: response.name,
                    Tag: "folder",
                    Path: response.parents[0],
                  };

                  //Add the new Folder to list of assets to be displayed
                  const allFiles: DropboxFileType[] = this.apiEndpointSrv.getFileListOnPathAsLiteral();
                  allFiles.push(newFolder);
                  this.apiEndpointSrv.setFileListOnPath(allFiles);
                }
              });
          }
        });
    } catch (ex) {
      throw ex;
    }
  }

  closeNewFolderModal(): void {
    const newModalFolder: HTMLElement = document.querySelector(
      "#new-folder-modal"
    );
    newModalFolder.classList.add("hide-element");
    newModalFolder.classList.remove("show-element");
  }

  ngOnDestroy(): void {
    this.subSink.unsubscribe();
  }
}
