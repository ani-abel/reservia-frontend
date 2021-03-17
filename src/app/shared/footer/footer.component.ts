import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-footer",
  template: `
    <footer class="text-center">
      <p class="text-center no-margin">RESERVIA</p>
    </footer>
  `,
  styles: [],
})
export class FooterComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
