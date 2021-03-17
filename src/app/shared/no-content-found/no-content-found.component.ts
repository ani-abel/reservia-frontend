import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-no-content-found",
  template: `<main>
    <img src="../../../../assets/images/trash-icon.png" alt="no-content" />
    <h2 class="text-center">NO CONTENT</h2>
  </main>`,
  styleUrls: ["./no-content-found.component.scss"],
})
export class NoContentFoundComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
