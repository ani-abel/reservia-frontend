import { Component, OnInit, Input } from "@angular/core";
import { SubSink } from "subsink";
import { DriveSpacePayload, CloudProvider } from "../../types/data.types";
import { ApiEndpointService } from "../../service/api-endpoint.service";

@Component({
  selector: "app-disk-storage-modal",
  template: `
    <!-- Modal for getting info on the Cloud drive (Begins) -->
    <div class="modal-container hide-element" id="cloud-disk-drive-modal">
      <div class="modal">
        <p class="modal-close no-margin text-right">
          <i
            class="fa fa-close cursor-pointer close-modal"
            (click)="closeDriveSpaceModal($event)"
          ></i>
        </p>
        <h2 class="modal-title no-margin text-center">Disk Space</h2>
        <div class="modal-content">
          <div class="disk-storage-container">
            <p>
              <img
                [src]="displayOptions.imagePath"
                [alt]="displayOptions.driveType"
              />
            </p>
            <h3 class="no-margin">{{ displayOptions.driveType }}</h3>
            <div class="progress-div">
              <div class="progess-label">
                <div class="progress-label-widget">
                  {{ driveSpacePayload?.CurrentlyUsed }}GB
                </div>
                <div class="progress-label-widget text-right">
                  {{ driveSpacePayload?.MaxSpace }}GB
                </div>
              </div>
              <progress
                id="file"
                [value]="driveSpacePayload?.CurrentlyUsed"
                [max]="driveSpacePayload?.MaxSpace"
              >
                32%
              </progress>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Modal for getting info on the Cloud drive (Ends) -->
  `,
  styles: [],
})
export class DiskStorageModalComponent implements OnInit {
  @Input() driveSpacePayload: DriveSpacePayload;
  subSink: SubSink = new SubSink();
  displayOptions: any;

  constructor(private readonly apiEndpointServ: ApiEndpointService) {}

  ngOnInit(): void {
    this.subSink.sink = this.apiEndpointServ
      .getAppProviderAsObs()
      .subscribe((response: CloudProvider) => {
        this.displayOptions =
          response === CloudProvider.DROPBOX
            ? {
                imagePath: "../../assets/images/dropbox-logo-3.png",
                driveType: "Dropbox Drive",
              }
            : {
                imagePath: "../../assets/images/google-drive-logo.png",
                driveType: "Google Drive",
              };
      });
  }

  closeDriveSpaceModal(event: string): void {
    const driveSpaceModal: HTMLElement = document.querySelector(
      "#cloud-disk-drive-modal"
    );
    driveSpaceModal.classList.remove("show-element");
    driveSpaceModal.classList.add("hide-element");
  }

  ngOnDestroy(): void {
    this.subSink.unsubscribe();
  }
}
