import { Component, OnInit, OnDestroy, DoCheck } from "@angular/core";
import { Router } from "@angular/router";
import { SubSink } from "subsink";
import { Observable } from "rxjs";
import { ApiEndpointService } from "../service/api-endpoint.service";
import { DropboxFileType, MediaType } from "../types/data.types";
import {
  SidebarInput,
  CloudProvider,
  SearchModalEventPayload,
  DriveSpacePayload,
  SearchModalPayload,
} from "../types/data.types";

@Component({
  selector: "app-drive-dashboard",
  templateUrl: "./google-drive-dashboard.component.html",
  styleUrls: ["./google-drive-dashboard.component.scss"],
})
export class GoogleDriveDashboardComponent
  implements OnInit, OnDestroy, DoCheck {
  closeAllModals = false;
  sidebarInputPayload: SidebarInput;
  subSink: SubSink = new SubSink();
  isUploadHappening$: Observable<boolean>;
  driveSpacePayload: DriveSpacePayload;
  searchResults: SearchModalPayload[];
  currentPathPointer$: Observable<string>;
  filesOnPath$: Observable<DropboxFileType[]>;

  constructor(
    private readonly apiEndpointSrv: ApiEndpointService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.subSink.sink = this.apiEndpointSrv
      .getGoogleUserDetails()
      .subscribe((response) => {
        this.sidebarInputPayload = {
          Username: response.name,
          ImagePath: response.picture,
        };
      });

    //Set the app provider name
    this.apiEndpointSrv.setAppProvider(CloudProvider.GOOGLE);

    //Set the Root path
    this.apiEndpointSrv.setFolderPointerLocation("/");

    this.currentPathPointer$ = this.apiEndpointSrv.getFolderPointerLocationAsObs();
    this.isUploadHappening$ = this.apiEndpointSrv.getIsUploadHappeningAsObs();

    this.subSink.sink = this.apiEndpointSrv
      .getFilesFromGoogle()
      .subscribe((response) => {
        //Set the files gotten from dropbox into a global observable that can be changed all over
        this.apiEndpointSrv.setFileListOnPath(response);
        //Set the app global observable to a local observable that can be subscribed to with the async pipe
        this.filesOnPath$ = this.apiEndpointSrv.getFileListOnPath();
      });
  }

  ngDoCheck(): void {
    //Check for token
    if (!this.checkForToken()) {
      this.router.navigate(["/"]);
    }
  }

  private checkForToken(): boolean {
    let isFound: boolean = false;
    const lsValue: any = this.apiEndpointSrv.getLocalStorageValues();
    if (lsValue) {
      if (this.apiEndpointSrv.getGoogleAuthTokenFromLocalStorage()) {
        isFound = true;
      }
    }
    return isFound;
  }

  openNewFileModal(): void {
    const newFileModal: HTMLElement = document.querySelector("#new-file-modal");
    newFileModal.classList.add("show-element");
    newFileModal.classList.remove("hide-element");
  }

  openNewFolderModal(): void {
    const newModalFolder: HTMLElement = document.querySelector(
      "#new-folder-modal"
    );
    newModalFolder.classList.remove("hide-element");
    newModalFolder.classList.add("show-element");
  }

  //Open the search modal
  openSearchModal(event: SearchModalEventPayload): void {
    const searchModal: HTMLElement = document.querySelector("#search-modal");
    searchModal.classList.add("show-element");
    searchModal.classList.remove("hide-element");

    //Search for the text the user entered
    this.subSink.sink = this.apiEndpointSrv
      .searchGoogleDrive(event.searchedText)
      .subscribe((response: any[]) => {
        this.searchResults = response.map((match) => {
          return {
            MediaType: /folder/.test(match.mimeType)
              ? MediaType.FOLDER
              : MediaType.FILE,
            FileName: match.name,
          };
        });
      });
  }

  //Open Drive Space Modal
  openDriveSpaceModal(): void {
    const driveSpaceModal: HTMLElement = document.querySelector(
      "#cloud-disk-drive-modal"
    );
    driveSpaceModal.classList.add("show-element");
    driveSpaceModal.classList.remove("hide-element");
    //Subscribe to get drive space
    this.subSink.sink = this.apiEndpointSrv
      .getGoogleDriveSpace()
      .subscribe((response) => {
        this.driveSpacePayload = response;
      });
  }

  goback(): void {
    try {
      const formattedPath: string = this.apiEndpointSrv.formatPathURL();
      this.apiEndpointSrv.setFolderPointerLocation(formattedPath);
      const currentFolderId: string = this.apiEndpointSrv.getCurrentFolderIdToPreview();
      this.apiEndpointSrv.setCurrentlyActiveGoogleFolder(currentFolderId);
      //Update the fileList Observable
      this.subSink.sink = this.apiEndpointSrv
        .getFilesFromGoogle()
        .subscribe((response: DropboxFileType[]) => {
          this.apiEndpointSrv.setFileListOnPath(response);
        });
    } catch (ex) {
      throw ex;
    }
  }

  ngOnDestroy(): void {
    this.subSink.unsubscribe();
  }
}
