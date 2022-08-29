import { NgModule } from '@angular/core';
import { TableDropdownComponent } from './components/table-dropdown/table-dropdown.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { NumberOnlyDirective } from './directives/number-only.directive';
import { InvalidMessageDirective } from './directives/reactive-error/invalid-message.directive';
import { InvalidTypeDirective } from './directives/reactive-error/invalid-type.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PhoneInputComponent } from './components/phone-input/phone-input.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonModule } from '@angular/common';
import { UppercaseDirective } from './directives/uppercase.directive';

@NgModule({
  declarations: [
    TableDropdownComponent,
    NumberOnlyDirective,
    InvalidMessageDirective,
    InvalidTypeDirective,
    PhoneInputComponent,
    UppercaseDirective
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BsDropdownModule.forRoot(),
    NgSelectModule
  ],
  exports: [
    TableDropdownComponent,
    NumberOnlyDirective,
    InvalidMessageDirective,
    InvalidTypeDirective,
    PhoneInputComponent,
    UppercaseDirective
  ]
})
export class QsmartAssetsLibModule { }
