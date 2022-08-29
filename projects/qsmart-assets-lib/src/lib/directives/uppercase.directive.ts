import {Directive, HostListener, Optional} from '@angular/core';
import {NgControl} from '@angular/forms';

@Directive({
  selector: '[libUppercase]'
})
export class UppercaseDirective {

  constructor(@Optional() private control: NgControl) {
  }

  @HostListener('input', ['$event']) onKeyDown(event: KeyboardEvent) {

    const target = event.target as HTMLInputElement;
    const targetValue = target.value;
    if (targetValue) {
      target.value = targetValue.toUpperCase();
      if (this.control) {
        this.control.reset(target.value);
      }
    }
  }
}
