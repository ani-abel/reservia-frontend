import { Component, Input, OnInit, OnDestroy } from "@angular/core";
import { SubSink } from "subsink";
import { Observable } from "rxjs";
import {
  DropboxFileType,
  CloudProvider,
  DefaultMessageType,
} from "../../types/data.types";
import { ApiEndpointService } from "../../service/api-endpoint.service";

@Component({
  selector: "app-file-widget",
  template: `
    <div class="file-widget">
      <div class="file-widget-column">
        <h4 class="no-margin text-uppercase" [title]="fileMetadata.Name">
          <i class="fa fa-file-o"></i> &nbsp;{{
            fileMetadata?.Name | shortenText
          }}
        </h4>
      </div>
      <div
        class="file-widget-column text-right cursor-pointer trigger-file-actions"
        appToggleFileActions
        #ref="appToggleFileActions"
      >
        <i class="fa fa-ellipsis-v"></i>
      </div>
      <div class="dropdown-content" *ngIf="ref.isOpen">
        <a
          *ngIf="fileMetadata.DownloadLink || (downloadLinkObs$ | async).link"
          [download]="fileMetadata?.Name"
          [href]="fileMetadata.DownloadLink || (downloadLinkObs$ | async).link"
          class="cursor-pointer"
          ><i class="fa fa-download"></i> Download</a
        >
        <a class="cursor-pointer" (click)="deleteFile()"
          ><i class="fa fa-trash"></i> Delete</a
        >
      </div>
    </div>
  `,
  styles: [],
})
export class FileWidgetComponent implements OnInit, OnDestroy {
  @Input() fileMetadata: DropboxFileType;
  private subSink: SubSink = new SubSink();
  downloadLinkObs$: Observable<any>;

  constructor(private readonly apiEndpointSrv: ApiEndpointService) {}

  ngOnInit(): void {
    if (this.fileMetadata) {
      this.downloadLinkObs$ = this.apiEndpointSrv.getDownloadLink(
        this.fileMetadata?.Path
      );
    }
  }

  deleteFile(): void {
    try {
      this.subSink.sink = this.apiEndpointSrv
        .getAppProviderAsObs()
        .subscribe((response: CloudProvider) => {
          if (response === CloudProvider.DROPBOX) {
            //It's dropbox
            //Hit the delete file endpoint
            this.subSink.sink = this.apiEndpointSrv
              .deleteFileFromDropbox(this.fileMetadata.Path)
              .subscribe((response: DefaultMessageType) => {
                if (response?.Message) {
                  //Open a message dialog to tell the user that we just deleted a file
                  this.apiEndpointSrv.displaySuccessMessage(response.Message);

                  this.subSink.sink = this.apiEndpointSrv
                    .getFileListOnPath()
                    .subscribe((response: DropboxFileType[]) => {
                      //on Response: get the global observable: FileListObs$ and filter out the deleted File
                      const fileList: DropboxFileType[] = response.filter(
                        (res: DropboxFileType) =>
                          res.Id !== this.fileMetadata.Id
                      );
                      //set timeout after delete to avoid a "Maximum call stack size error"
                      setTimeout(() => {
                        this.apiEndpointSrv.setFileListOnPath(fileList);
                      }, 2000);
                    });
                }
              });
          }
          if (response === CloudProvider.GOOGLE) {
            //It's Google
            this.subSink.sink = this.apiEndpointSrv
              .deleteFileFromGoogle(this.fileMetadata.Id)
              .subscribe((response: DefaultMessageType) => {
                if (response?.Message) {
                  //Open a message dialog to tell the user that we just deleted a file
                  this.apiEndpointSrv.displaySuccessMessage(response.Message);

                  this.subSink.sink = this.apiEndpointSrv
                    .getFileListOnPath()
                    .subscribe((response: DropboxFileType[]) => {
                      //on Response: get the global observable: FileListObs$ and filter out the deleted File
                      const fileList: DropboxFileType[] = response.filter(
                        (res: DropboxFileType) =>
                          res.Id !== this.fileMetadata.Id
                      );
                      //set timeout after delete to avoid a "Maximum call stack size error"
                      setTimeout(() => {
                        this.apiEndpointSrv.setFileListOnPath(fileList);
                      }, 2000);
                    });
                }
              });
          }
        });
    } catch (ex) {
      throw ex;
    }
  }

  ngOnDestroy(): void {
    this.subSink.unsubscribe();
  }
}
