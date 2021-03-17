import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy,
} from "@angular/core";
import { Observable } from "rxjs";
import { SubSink } from "subsink";
import { SidebarInput, CloudProvider } from "../../types/data.types";
import { ApiEndpointService } from "../../service/api-endpoint.service";

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styles: [],
})
export class SidebarComponent implements OnInit, OnDestroy {
  @Input() sidebarInput: SidebarInput;
  @Output() driveSpaceModal: EventEmitter<any> = new EventEmitter<any>();
  currentCloudProvider$: Observable<CloudProvider>;
  subSink: SubSink = new SubSink();

  constructor(private readonly apiEndpointSrv: ApiEndpointService) {}

  ngOnInit(): void {
    this.currentCloudProvider$ = this.apiEndpointSrv.getAppProviderAsObs();
  }

  emptyRecycleBin(): void {
    this.subSink.sink = this.apiEndpointSrv
      .emptyGoogleRecycleBin()
      .subscribe((response) => {
        this.apiEndpointSrv.displaySuccessMessage(response.Message);
      });
  }

  openDriveSpaceModal(): void {
    this.driveSpaceModal.emit();
  }

  ngOnDestroy(): void {
    this.subSink.unsubscribe();
  }
}
