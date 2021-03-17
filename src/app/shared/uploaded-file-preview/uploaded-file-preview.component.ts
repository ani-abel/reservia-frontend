import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-uploaded-file-preview",
  template: ` <div class="file-widget">
    <div class="file-widget-column">
      <h4 class="no-margin text-uppercase">
        <i class="fa fa-file-o"></i> &nbsp;{{ file.name | uppercase }}
      </h4>
    </div>
  </div>`,
  styles: [],
})
export class UploadedFilePreviewComponent implements OnInit {
  @Input() file: File;
  constructor() {}

  ngOnInit(): void {}
}
