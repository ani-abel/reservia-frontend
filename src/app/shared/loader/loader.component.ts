import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-loader",
  template: `
    <main [ngClass]="['text-center']">
      <img src="../../../assets/images/loader-icon.webp" />
    </main>
  `,
  styles: [
    `
      main {
        background: rgba(0, 0, 0, 0.9);
        width: 100vw;
        height: 100vh;
        position: fixed;
        z-index: 999999999;
      }
    `,
    `
      img {
        width: 13%;
        height: 25%;
        margin-top: 10%;
        box-shadow: var(--box-shadow-xl);
      }
    `,
  ],
})
export class LoaderComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
