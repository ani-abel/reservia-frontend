import { Component, OnInit, Input } from "@angular/core";
import { SearchModalPayload } from "../../types/data.types";

@Component({
  selector: "app-searched-folder-widget",
  template: `
    <div class="file-widget">
      <div class="file-widget-column">
        <h4 class="no-margin text-uppercase">
          <i class="fa fa-folder-o"></i> &nbsp;{{
            fileMetadata.FileName | uppercase
          }}
        </h4>
      </div>
    </div>
  `,
  styles: [],
})
export class SearchedFolderWidgetComponent implements OnInit {
  @Input() fileMetadata: SearchModalPayload;

  constructor() {}

  ngOnInit(): void {}
}
