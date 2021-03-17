import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy,
} from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { SubSink } from "subsink";
import { ModalType, SearchModalEventPayload } from "../../types/data.types";
import { ApiEndpointService } from "../../service/api-endpoint.service";

@Component({
  selector: "app-nav",
  templateUrl: "./nav.component.html",
  styles: [],
})
export class NavComponent implements OnInit, OnDestroy {
  @Output() searchModalOpen: EventEmitter<
    SearchModalEventPayload
  > = new EventEmitter<SearchModalEventPayload>();
  searchForm: FormGroup;
  subSink: SubSink = new SubSink();
  placeholderText: string;

  constructor(private readonly apiEndpointSrv: ApiEndpointService) {}

  ngOnInit(): void {
    this.initForm();
    this.subSink.sink = this.apiEndpointSrv
      .getFolderPointerLocationAsObs()
      .subscribe((response: string) => {
        this.placeholderText = `Search '${response}'`;
      });
  }

  initForm(): void {
    this.searchForm = new FormGroup({
      searchedText: new FormControl(null, Validators.required),
    });
  }

  submitForm(): void {
    if (this.searchForm.invalid) {
      return;
    }
    const { searchedText } = this.searchForm.value;
    this.searchModalOpen.emit({ purpose: ModalType.SEARCH, searchedText });
  }

  ngOnDestroy(): void {
    this.subSink.unsubscribe();
  }
}
