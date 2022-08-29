import { Directive, HostBinding, HostListener, Input, Optional } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appNumberOnly]'
})
export class NumberOnlyDirective {
  private regex: RegExp = new RegExp(/^\d*\.?\d{0,2}$/g);

  // @HostBinding('type') get type() {
  //   return this.allowDecimal ? 'text' : 'number';
  // }

  @Input() allowDecimal = true;
  @Input() allowNegative = false;
  @Input() precision?: number;
  @Input() limit?: number;

  @HostListener('keydown', ['$event']) onKeyDown(event: KeyboardEvent) {
    const ALLOWED = [
      'Delete', 'Backspace', 'Tab', 'Escape', 'Enter', 'Home', 'End', 'ArrowLeft', 'ArrowRight',
    ];
    /**
     * If Decimal Allowed it should allow Only One decimal As number Can contain only one Decimal.
     * It Also Checks user Should insert At least one Number before Decimal
     */
    const target = event.target as HTMLInputElement;
    const targetValue = target.value;
    const cursorPosition = target.selectionStart;

    /**
     * Allow Decimal Conditionally
     */
    const shouldAllowDecimal = (this.allowDecimal && !targetValue.includes('.'));
    if (shouldAllowDecimal) {
      ALLOWED.push('.');
    }

    /**
     * Allow Negative Conditionally
     */
    const shouldAllowNegative = (this.allowNegative && !targetValue.includes('-'));
    if (shouldAllowNegative && cursorPosition === 0) {
      ALLOWED.push('-');
    }

    /**
     * when User only inserts a decimal at beginning replace it with a valid number.
     */
    if (this.allowDecimal && !targetValue.length && event.code === 'NumpadDecimal') {
      target.value = targetValue.replace('.', '') || '0.';
      if (this.control) {
        this.control.reset(target.value);
      }
      event.preventDefault();
    }

    if (
      ALLOWED.includes(event.key) ||
      // Allow: Ctrl+A
      (event.code === 'KeyA' && (event.ctrlKey || event.metaKey)) ||
      // Allow: Ctrl+C
      (event.code === 'KeyC' && (event.ctrlKey || event.metaKey)) ||
      // Allow: Ctrl+V
      (event.code === 'KeyV' && (event.ctrlKey || event.metaKey)) ||
      // Allow: Ctrl+X
      (event.code === 'KeyX' && (event.ctrlKey || event.metaKey))
    ) {
      // let it happen, don't do anything
      return;
    }
    // If not a number key Then Prevent
    if (Number.isNaN(Number(event.key)) || event.code === 'Space') {
      event.preventDefault();
    }
    // If limit is exist Then Prevent
    if (this.limit) {
      // const values: string[] = (target.value || '').split('.');
      // if (values[0].length && values[0].length >= this.limit) {
      //   event.preventDefault();
      // }


      const values: string[] = (target.value || '').split('.');
      let length = 0;
      values.forEach(v => length += v.length);
      if (length && length >= this.limit) {
        event.preventDefault();
      }
    }

  }

  /**
   * Prevent Pasting Not number values
   */
  @HostListener('paste', ['$event']) onPaste(event: KeyboardEvent | any) {
    const target = event.target as HTMLInputElement;
    const targetValue: string = target.value;
    const clipboardValue: string = event.clipboardData.getData('text/plain');
    /**
     * if Decimal is not allowed and clipboard includes Decimal.
     */
    const preventValueWithDecimal = !this.allowDecimal && clipboardValue.includes('.');
    const preventNegative = !this.allowNegative && clipboardValue.includes('-');

    // if Decimal already exist and clipboard also
    const decimalAlreadyExist = this.allowDecimal && clipboardValue.includes('.') && targetValue.includes('.');

    if (Number.isNaN(Number(clipboardValue)) || preventValueWithDecimal || preventNegative || decimalAlreadyExist) {
      event.preventDefault();
    }
  }

  /**
   * After Key Up Check the number
   * If not a number then do something with the typed Value, In this case value will be converted to closes valid number.
   * For Example a leading Decimal(.) will be '0.' if user only types '.'
   * And these checks is only required when Decimal is Allowed.
   */
  @HostListener('keyup', ['$event']) onKeyUp(event: KeyboardEvent) {
    const target = event.target as HTMLInputElement;
    const targetValue: string = target.value;


    /**
     * mutations
     */
    const MUTATORS = ['ArrowUp', 'ArrowDown']

    if (event.key === 'ArrowUp') {
      target.value = (parseFloat(targetValue) + 1) + '';

      if (this.control) {
        this.control.reset(target.value);
      }
    } else if (event.key === 'ArrowDown') {
      target.value = (parseFloat(targetValue) - 1) + '';

      if (this.control) {
        this.control.reset(target.value);
      }
    } else if (this.allowDecimal && targetValue.length && Number.isNaN(Number(targetValue))) {
      /**
       * when User only inserts a decimal at beginning replace it with a valid number.
       */
      target.value = targetValue.replace('.', '') || '0.';
      if (this.control) {
        this.control.reset(target.value);
      }
    }
  }

  constructor(@Optional() private control: NgControl) {
  }


  @HostListener('input', ['$event']) onInput(event: KeyboardEvent): void {
    const target = event.target as HTMLInputElement;


    if (this.allowDecimal && this.precision) {
      const values: string[] = (target.value || '').split('.');

      if (values[1]?.length > this.precision) {
        values[1] = values[1].substr(0, this.precision);
        target.value = values.join('.');

        this.control?.reset(target.value);
      }
    }
  }
}
