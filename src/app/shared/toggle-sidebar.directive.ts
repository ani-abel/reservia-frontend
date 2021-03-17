import { Directive, ElementRef, HostListener, Input } from "@angular/core";

@Directive({
  selector: "[appToggleSidebar]",
  exportAs: "appToggleSidebar",
})
export class ToggleSidebarDirective {
  @Input() cssClassOne: string; //toggle-button-left
  @Input() cssClassTwo: string; //toggle-button-left-collapse
  isOpen: boolean = true;

  constructor(private readonly el: ElementRef) {}

  @HostListener("click")
  clickListener(): void {
    this.isOpen = !this.isOpen;
    if (!this.isOpen) {
      this.el.nativeElement.classList.remove(this.cssClassOne);
      this.el.nativeElement.classList.add(this.cssClassTwo);
    } else {
      this.el.nativeElement.classList.remove(this.cssClassTwo);
      this.el.nativeElement.classList.add(this.cssClassOne);
    }
  }
}
