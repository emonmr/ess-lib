import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import {AbstractControl, UntypedFormControl, Validators} from '@angular/forms';
import {Subject} from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { countryCodes } from '../../data/country-codes';
import { CountryCode } from '../../models/country-code.model';

@Component({
  selector: 'app-phone-input',
  templateUrl: './phone-input.component.html',
  styleUrls: ['./phone-input.component.scss']
})
export class PhoneInputComponent implements OnInit, OnDestroy, OnChanges {
  private readonly ngUnsubscribe = new Subject<void>();
  countryCodes: CountryCode[] = [];
  countryCode = new UntypedFormControl({ value: '+353', disabled: true }, Validators.required);
  phone = new UntypedFormControl({ value: null, disabled: true }, Validators.required);

  @Input() control?: AbstractControl;
  @Input() label?: string;
  @Input() value?: string;
  @Input() disabled = false;

  @Output() valueChange: EventEmitter<string | null> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {

    if (this.control?.value) {
      this.setPhoneControl(this.control.value);
    }

    this.countryCodes = countryCodes;

    this.countryCode.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => this.emitValue());

    this.phone.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => this.emitValue());
    this.setFormState();
    this.setInitialValues();

    // listen to change input value and then set to phone control
    this.control?.valueChanges.subscribe(item => {
      this.setPhoneControl(item);
    })
  }

  private setPhoneControl(item: string) {
    if (item) {
      const splitArray = item?.split('-');
      if (splitArray.length && splitArray.length > 1) {
        this.phone.setValue(splitArray[1], {emitEvent: false})
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {

    if ('disabled' in changes) {
      this.setFormState();
    }
  }

  private setFormState(): void {
    if (this.disabled) {
      this.countryCode.disable();
      this.phone.disable();
    } else {
      this.countryCode.enable();
      this.phone.enable();
    }
  }

  private setInitialValues(): void {
    const value: string | null = this.control?.value || this.value || null;
    if (!value) {
      this.phone.setValue(null);
      return;
    }

    const parts = value.split('-');

    if (parts.length > 1) {
      if (this.countryCodes.some(({ phoneNumberCode }) => phoneNumberCode === parts[0])) {
        this.countryCode.setValue(parts.shift());
      }

      this.phone.setValue(parts.join('-'));
    } else {
      this.phone.setValue(value);
    }
  }

  private emitValue(): void {
    let value: string | null = null;

    if (this.countryCode.valid && this.phone.valid) {
      value = this.countryCode.value + '-' + this.phone.value;
    }

    this.control?.setValue(value);
    this.valueChange.emit(value);
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
