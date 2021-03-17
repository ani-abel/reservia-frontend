import { Component, OnInit, OnDestroy, DoCheck } from "@angular/core";
import { Router } from "@angular/router";
import { SubSink } from "subsink";
import { Observable } from "rxjs";
import { ApiEndpointService } from "../service/api-endpoint.service";
import { DropboxFileType } from "../types/data.types";
import {
  SearchModalPayload,
  MediaType,
  DriveSpacePayload,
} from "../types/data.types";
import {
  SidebarInput,
  CloudProvider,
  SearchModalEventPayload,
} from "../types/data.types";

@Component({
  selector: "app-dropbox-drive-dashboard",
  templateUrl: "./dropbox-drive-dashboard.component.html",
  styleUrls: ["./dropbox-drive-dashboard.component.scss"],
})
export class DropboxDriveDashboardComponent
  implements OnInit, OnDestroy, DoCheck {
  sidebarInputPayload: SidebarInput;
  subSink: SubSink = new SubSink();
  searchResults: SearchModalPayload[];
  driveSpacePayload: DriveSpacePayload;
  isUploadHappening$: Observable<boolean>;
  filesOnPath$: Observable<DropboxFileType[]>;
  currentPathPointer$: Observable<string>;

  constructor(
    private readonly apiEndpointSrv: ApiEndpointService,
    private readonly router: Router
  ) {}

  // formatJson(json: any): string[] {
  //   const obj = json.data;
  //   const matches: string[] = (obj as string).match(/age\=\d+/g);
  //   return matches;
  // }

  ngOnInit(): void {
    //Set the current cloud provider
    this.apiEndpointSrv.setAppProvider(CloudProvider.DROPBOX);

    //Set the Root path
    this.apiEndpointSrv.setFolderPointerLocation("/");
    this.subSink.sink = this.apiEndpointSrv
      .getDropboxUserDetails()
      .subscribe((response: any) => {
        this.sidebarInputPayload = {
          Username: response.display_name,
        };
      });

    this.currentPathPointer$ = this.apiEndpointSrv.getFolderPointerLocationAsObs();
    this.subSink.sink = this.apiEndpointSrv
      .getFilesFromDropbox()
      .subscribe((response: DropboxFileType[]) => {
        //Set the files gotten from dropbox into a global observable that can be changed all over
        this.apiEndpointSrv.setFileListOnPath(response);
        //Set the app global observable to a local observable that can be subscribed to with the async pipe
        this.filesOnPath$ = this.apiEndpointSrv.getFileListOnPath();
      });

    //set observable to watch when a file upload is about to happen, so a loader can be opened
    this.isUploadHappening$ = this.apiEndpointSrv.getIsUploadHappeningAsObs();
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
      if (this.apiEndpointSrv.getDropboxAuthTokenFromLocalStorage()) {
        isFound = true;
      }
    }
    return isFound;
  }

  goback(): void {
    try {
      const formattedPath: string = this.apiEndpointSrv.formatPathURL();
      this.apiEndpointSrv.setFolderPointerLocation(formattedPath);
      //Update the fileList Observable
      this.subSink.sink = this.apiEndpointSrv
        .getFilesFromDropbox()
        .subscribe((response: DropboxFileType[]) => {
          this.apiEndpointSrv.setFileListOnPath(response);
        });
    } catch (ex) {
      throw ex;
    }
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
      .searchDropboxDrive(event.searchedText)
      .subscribe((response: any) => {
        const { matches } = response;
        this.searchResults = (matches as any[]).map((match) => {
          const { metadata } = match.metadata;
          return {
            MediaType:
              metadata[".tag"] && metadata[".tag"] === "folder"
                ? MediaType.FOLDER
                : MediaType.FILE,
            FileName: metadata.name,
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

    //Get the space available on the drive
    this.subSink.sink = this.apiEndpointSrv
      .getDropboxDriveSpace()
      .subscribe((response: DriveSpacePayload) => {
        this.driveSpacePayload = response;
      });
  }

  ngOnDestroy(): void {
    this.subSink.unsubscribe();
  }
}
