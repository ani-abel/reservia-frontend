import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { ApiEndpointService } from "../../service/api-endpoint.service";

@Component({
  selector: "app-error-message-modal",
  template: `
    <!-- Error Message Modal (Begins) -->
    <section class="message-modal danger-modal hide-element" id="danger-modal">
      <div class="message-widget">
        <img src="../assets/images/fail-icon.png" alt="Error Icon" />
      </div>
      <div class="message-widget">{{ message$ | async }}</div>
      <div class="message-widget text-right">
        <i
          class="fa fa-times close-message-modal cursor-pointer"
          (click)="closeModal()"
        ></i>
      </div>
    </section>
    <!-- Error Message Modal (Ends) -->
  `,
  styles: [],
})
export class ErrorMessageModalComponent implements OnInit {
  message$: Observable<string> = this.apiEndpointSrv.getErrorMessageAsObs();

  constructor(private readonly apiEndpointSrv: ApiEndpointService) {}

  ngOnInit(): void {}

  closeModal(): void {
    const modal: HTMLElement = document.querySelector("#danger-modal");
    modal.classList.remove("show-element-flex");
    modal.classList.add("hide-element");
  }
}
