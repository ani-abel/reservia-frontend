import { Component, OnInit, Input } from "@angular/core";
import { SearchModalPayload } from "../../types/data.types";
import { ApiEndpointService } from "../../service/api-endpoint.service";

@Component({
  selector: "app-search-modal",
  template: `
    <!-- Modal for search for content on a root drive (Begins) -->
    <div class="modal-container hide-element" id="search-modal">
      <div class="modal">
        <p class="modal-close no-margin text-right">
          <i
            class="fa fa-close cursor-pointer close-modal"
            (click)="closeModal()"
          ></i>
          <!-- <i class="fa fa-close cursor-pointer close-modal" appCloseModals></i> -->
        </p>
        <h2 class="modal-title no-margin text-center">Search File(s)</h2>
        <p class="modal-title-helper text-center no-margin">
          {{ currentFolderPath }}
        </p>
        <div class="modal-content">
          <div class="files-list-container form-group">
            <main *ngIf="searchModalPayload?.length; else defaultTemplate">
              <div *ngFor="let searchPayload of searchModalPayload">
                <app-searched-folder-widget
                  *ngIf="
                    searchPayload.MediaType === 'FOLDER';
                    else fileTemplate
                  "
                  [fileMetadata]="searchPayload"
                ></app-searched-folder-widget>
                <ng-template #fileTemplate>
                  <app-searched-file-widget
                    [fileMetadata]="searchPayload"
                  ></app-searched-file-widget>
                </ng-template>
              </div>
            </main>
            <ng-template #defaultTemplate>
              <app-no-content-found></app-no-content-found>
            </ng-template>
          </div>
        </div>
      </div>
    </div>
    <!-- Modal for search for content on a root drive (Ends) -->
  `,
  styles: [],
})
export class SearhModalComponent implements OnInit {
  currentFolderPath: string = this.apiEndpointSrv.getFolderPointerLocation();
  @Input() searchModalPayload: SearchModalPayload[];

  constructor(private readonly apiEndpointSrv: ApiEndpointService) {}

  ngOnInit(): void {}

  closeModal(): void {
    const searchModal: HTMLElement = document.querySelector("#search-modal");
    searchModal.classList.remove("show-element");
    searchModal.classList.add("hide-element");
  }
}
