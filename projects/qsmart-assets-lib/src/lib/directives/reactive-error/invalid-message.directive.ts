import {Directive, ElementRef, Input, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {AbstractControl, ControlContainer, FormGroup, FormGroupDirective, FormGroupName} from '@angular/forms';
import {BehaviorSubject, merge, Observable, of, Subject} from 'rxjs';
import {map, takeUntil} from 'rxjs/operators';

@Directive({
  selector: '[appInvalidMessage]',
})
export class InvalidMessageDirective implements OnInit, OnDestroy {
  @Input() appInvalidMessage = '';
  @Input() showWithoutSubmit = false;
  @Input() isHighLightLabel = false;
  // @ts-ignore
  controlValue$: Observable<any>;
  // @ts-ignore
  private control: AbstractControl | null = null;
  private hasSubmitted = false;
  private componentDestroyed = new Subject<void>();
  private touchChanges = new BehaviorSubject<boolean>(false);
  constructor(
    private fg: ControlContainer,
    private el: ElementRef,
    private render: Renderer2
  ) {
  }

  get form() {
    return this.fg.formDirective ? (this.fg.formDirective as FormGroupDirective).form : null;
  }

  ngOnInit() {
    let formSubmit$: any;

    if(this.fg && typeof this.fg !== 'undefined') {
      const parentControlContainer: FormGroupDirective = <FormGroupDirective>(<FormGroupName>this.fg).formDirective;
      formSubmit$ = parentControlContainer.ngSubmit.pipe(map(() => {
        this.hasSubmitted = true
      }))
    }

    // this.control = this.form ? (this.form.get(this.appInvalidMessage) as AbstractControl) : null;
    this.control = this.fg.control?.get(this.appInvalidMessage) as AbstractControl || null;

    // @ts-ignore
    if (this.control && this.control.enabled) {
      const prevMarkAsTouched = this.control.markAsTouched;
      this.control.markAsTouched = (opt?: { onlySelf: boolean }) => {
        prevMarkAsTouched.bind(this.control)(opt);
        this.touchChanges.next(true);
      };

      const prevMarkAsUntouched = this.control.markAsUntouched;
      this.control.markAsUntouched = (opt?: { onlySelf: boolean }) => {
        prevMarkAsUntouched.bind(this.control)(opt);
        this.touchChanges.next(false);
      };

      this.controlValue$ = merge(this.control.valueChanges, of(''), formSubmit$, this.touchChanges);
      this.controlValue$
        .pipe(takeUntil(this.componentDestroyed))
        .subscribe(() => this.setVisible());

      // this.touchChanges
      //   .pipe(takeUntil(this.componentDestroyed))
      //   .subscribe(() => this.setVisible());
    }
  }

  match(error: string) {
    if (this.control && this.control.errors) {
      if (Object.keys(this.control.errors).indexOf(error) > -1) {
        return true;
      }
    }
    return false;
  }

  ngOnDestroy() {
    this.componentDestroyed.next();
    this.componentDestroyed.complete();
  }

  private setVisible() {
    if (this.isHighLightLabel) {
      this.render.removeStyle(this.el.nativeElement, 'display');
      if (this.isError) {
        this.render.addClass(this.el.nativeElement, 'form-error');
      } else {
        this.render.removeClass(this.el.nativeElement, 'form-error');
      }
    } else {
      this.render.removeClass(this.el.nativeElement, 'form-error');
      if (this.isError) {
        this.render.removeStyle(this.el.nativeElement, 'display');
      } else {
        this.render.setStyle(this.el.nativeElement, 'display', 'none');
      }
    }
  }

  private get isError(): boolean {
    // const parentControlContainer: FormGroupDirective = <FormGroupDirective>(<FormGroupName>this.fg).formDirective;
    if (!this.control || this.control.valid || this.control.disabled) return false;

    if (this.showWithoutSubmit) {
      return this.control.touched || this.control.dirty || this.hasSubmitted;
    }

    return this.hasSubmitted; // && (this.control.touched || this.control.dirty);
  }
}
