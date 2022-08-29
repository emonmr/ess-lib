import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, Inject, Input, ViewChild } from '@angular/core';
import { BsDropdownDirective } from 'ngx-bootstrap/dropdown';

@Component({
  selector: 'app-table-dropdown',
  templateUrl: './table-dropdown.component.html',
  styleUrls: ['./table-dropdown.component.scss']
})
export class TableDropdownComponent {
  private readonly scrollContainerSelectors = '.app-table--responsive, .ps, .ng-scroll-viewport';

  @Input() container = 'body';
  @Input() iconWidth: string | number = 16;
  @Input() iconViewBox = '0 0 18 18';
  @Input() iconName = 'svg-cog';

  @ViewChild('buttonRef') buttonRef!: ElementRef<HTMLButtonElement>;
  @ViewChild(BsDropdownDirective) dropdown!: BsDropdownDirective;

  constructor(
    @Inject(DOCUMENT) private document: Document
  ) { }

  onOpenChange(state: boolean) {
    if (!state || !this.document.defaultView) {
      return;
    }

    this.document.defaultView.dispatchEvent(new CustomEvent('scroll'));

    setTimeout(() => {
      if (!this.document.defaultView) {
        return;
      }

      const dropdown = this.document.querySelector('ul.app-table--dropdown_2') as HTMLUListElement;
      const { y, height } = dropdown.getBoundingClientRect();

      if (y + height > this.document.defaultView.innerHeight) {
        const btnHeight = this.buttonRef.nativeElement.clientHeight;
        dropdown.style.transform = `translateY(-${height + btnHeight + 3}px)`;
      } else {
        dropdown.style.transform = '';
      }

      dropdown.classList.add('active');
    }, 50);
  }

  onOpen(): void {
    const parent = this.buttonRef.nativeElement.closest(this.scrollContainerSelectors) as HTMLElement;

    setTimeout(() => {
      if (!this.document.defaultView) {
        return;
      }

      if (parent) {
        parent.onscroll = () => this.dropdown.hide();
      }

      this.document.defaultView.onscroll = () => this.dropdown.hide();
    }, 50);
  }

  onHide(): void {
    if (!this.document.defaultView) {
      return;
    }

    const parent = this.buttonRef.nativeElement.closest(this.scrollContainerSelectors) as HTMLElement;

    this.document.defaultView.onscroll = null;
    if (parent?.onscroll) {
      parent.onscroll = null;
    }
  }

}
