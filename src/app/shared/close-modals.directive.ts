import {
  Directive,
  ElementRef,
  HostListener,
  Output,
  EventEmitter,
  ViewContainerRef,
} from "@angular/core";

@Directive({
  selector: "[appCloseModals]",
})
export class CloseModalsDirective {
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private readonly el: ElementRef,
    private readonly viewContainerRef: ViewContainerRef
  ) {}

  @HostListener("click")
  clickHandler(): void {
    console.log("Trying to clear out");
    this.closeModal.emit(true);
    this.el.nativeElement.closest(".modal-container").style.display = "none";
  }
}
