import { Directive, Input, ElementRef, HostListener } from "@angular/core";
import { ModalType } from "../types/data.types";

@Directive({
  selector: "[appOpenModal]",
  exportAs: "appOpenModal",
})
export class OpenModalDirective {
  @Input() purpose: ModalType;
  modalToOpen: string;

  constructor(private readonly el: ElementRef) {}

  @HostListener("click")
  clickHandler(): void {
    switch (this.purpose) {
      case ModalType.DRIVE_SPACE:
        this.modalToOpen = ModalType.DRIVE_SPACE;
        break;
      case ModalType.NEW_FILE:
        this.modalToOpen = ModalType.NEW_FILE;
        break;
      case ModalType.NEW_FOLDER:
        this.modalToOpen = ModalType.NEW_FOLDER;
        break;
    }
  }

  @HostListener("modalPurpose", ["$event"])
  modalPurposeHandler(event): void {
    this.modalToOpen = event;
  }

  @HostListener("searchModalOpen", ["$event"])
  searchModalOpenHandler(event): void {
    this.modalToOpen = event;
  }
}
