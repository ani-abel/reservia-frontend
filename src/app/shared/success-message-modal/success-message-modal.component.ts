import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { ApiEndpointService } from "../../service/api-endpoint.service";

@Component({
  selector: "app-success-message-modal",
  template: `
    <!-- Success Message Modal (Begins) -->
    <section
      class="message-modal success-modal hide-element"
      id="success-modal"
    >
      <div class="message-widget">
        <img src="../assets/images/success-icon.webp" alt="Success Icon" />
      </div>
      <div class="message-widget">{{ message$ | async }}</div>
      <div class="message-widget text-right">
        <i
          class="fa fa-times close-message-modal cursor-pointer"
          (click)="closeModal()"
        ></i>
      </div>
    </section>
    <!-- Success Message Modal (Ends) -->
  `,
  styles: [],
})
export class SuccessMessageModalComponent implements OnInit {
  message$: Observable<string>;

  constructor(private readonly apiEndpointSrv: ApiEndpointService) {
    this.message$ = this.apiEndpointSrv.getSuccessMessageAsObs();
  }

  ngOnInit(): void {}

  closeModal(): void {
    const modal: HTMLElement = document.querySelector("#success-modal");
    modal.classList.remove("show-element-flex");
    modal.classList.add("hide-element");
  }
}
