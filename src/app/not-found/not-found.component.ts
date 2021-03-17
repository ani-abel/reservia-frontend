import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-not-found",
  template: ` <main class="container">
    <section class="login-container">
      <h2 class="text-center no-margin app-title index-title">
        <span><i class="fa fa-server"></i></span>RESERVIA
      </h2>
      <div class="button-section text-center">
        <h1 class="caption-404 no-margin">404</h1>
      </div>
    </section>
  </main>`,
  styles: [],
})
export class NotFoundComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
