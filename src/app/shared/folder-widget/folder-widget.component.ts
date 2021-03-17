import { Component, Input, OnInit, OnDestroy } from "@angular/core";
import { SubSink } from "subsink";
import { DropboxFileType, CloudProvider } from "../../types/data.types";
import { ApiEndpointService } from "../../service/api-endpoint.service";
import { Observable } from "rxjs";

@Component({
  selector: "app-folder-widget",
  template: `
    <div class="file-widget folder-widget">
      <div class="file-widget-column">
        <h4
          (dblclick)="openFolder()"
          class="open-folder cursor-pointer no-margin text-uppercase"
          [title]="fileMetadata.Name"
        >
          <i class="fa fa-folder-o"></i> &nbsp;{{
            fileMetadata?.Name | shortenText
          }}
        </h4>
      </div>
    </div>
  `,
  styles: [],
})
export class FolderWidgetComponent implements OnInit, OnDestroy {
  @Input() fileMetadata: DropboxFileType;
  private subSink: SubSink = new SubSink();

  constructor(private readonly apiEndpointSrv: ApiEndpointService) {}

  ngOnInit(): void {}

  openFolder(): void {
    try {
      //Update the Global path
      this.subSink.sink = this.apiEndpointSrv
        .getAppProviderAsObs()
        .subscribe((response: CloudProvider) => {
          if (response === CloudProvider.DROPBOX) {
            //Its dropbox
            this.apiEndpointSrv.setFolderPointerLocation(
              this.fileMetadata?.Path
            );
            //Get all the files inside a given folder
            this.subSink.sink = this.apiEndpointSrv
              .getFilesFromDropbox()
              .subscribe((response: DropboxFileType[]) => {
                this.apiEndpointSrv.setFileListOnPath(response);
              });
          }
          if (response === CloudProvider.GOOGLE) {
            //It's google
            let currentFolderId: string = this.apiEndpointSrv.getGoogleFileIdBuilder();
            currentFolderId = `${currentFolderId}*${this.fileMetadata.Id}`;
            this.apiEndpointSrv.setGoogleFileIdBuilder(currentFolderId);

            //Set the Path for Google
            this.apiEndpointSrv.setCurrentlyActiveGoogleFolder(
              this.fileMetadata?.Id
            );

            //Get all the files inside a given folder
            this.subSink.sink = this.apiEndpointSrv
              .getFilesFromGoogle()
              .subscribe((response: DropboxFileType[]) => {
                this.apiEndpointSrv.setFileListOnPath(response);
                this.appendToFilePath();
              });
          }
        });
    } catch (ex) {
      throw ex;
    }
  }

  private appendToFilePath(): void {
    let currentFilePath: string;
    this.subSink.sink = this.apiEndpointSrv
      .getFolderPointerLocationAsObs()
      .subscribe((response: string) => {
        currentFilePath =
          response === "/"
            ? `${response}${this.fileMetadata.Name}`
            : `${response}/${this.fileMetadata.Name}`;
      });
    this.apiEndpointSrv.setFolderPointerLocation(currentFilePath);
  }

  ngOnDestroy(): void {
    this.subSink.unsubscribe();
  }
}
