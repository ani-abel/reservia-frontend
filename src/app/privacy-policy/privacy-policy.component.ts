import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-privacy-policy",
  templateUrl: "./privacy-policy.component.html",
  styles: [
    `
      main {
        border-radius: 10px;
        margin: 0 auto;
        width: 60%;
        background: var(--color-white);
        box-shadow: var(--box-shadow-lg);
        padding: 20px 25px;
        margin-top: 50px;
      }

      .title-p {
        font-weight: 600;
      }

      ul li {
        list-style: inside;
        padding-bottom: 10px;
      }

      @media (max-width: 768px) {
        main {
          width: 90%;
        }
      }

      @media (max-width: 576px) {
        main {
          width: 95%;
        }
      }
    `,
  ],
})
export class PrivacyPolicyComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
