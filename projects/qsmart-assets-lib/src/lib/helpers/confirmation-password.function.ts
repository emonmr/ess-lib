import {AbstractControl, FormGroup, ValidationErrors} from '@angular/forms';

export function matchValues(
  matchTo: string // name of the control to match to
): (control: AbstractControl) => ValidationErrors | null {
  return (control: AbstractControl): ValidationErrors | null => {
    return !!control.parent &&
    !!control.parent.value &&
    control.value === ((control.parent as FormGroup).controls[matchTo])?.value
      ? null
      : {isMatching: false};
  };
}
