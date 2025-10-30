import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import { ALPHANUMERIC_REGEX, EMAIL_REGEX, ISRAEL_MOBILE_PHONE_REGEX } from '../../../../shared/regex/regex';
import { TextInput } from '../../../../shared/components/inputs/text-input/text-input';
import { NumberInput } from '../../../../shared/components/inputs/number-input/number-input';
import { DateInput } from '../../../../shared/components/inputs/date-input/date-input';
import { SignaturePad } from '../../../../shared/components/signature-pad/signature-pad';
import { Button } from '../../../../shared/components/buttons/button/button';
import { InvoiceFormCustomErrorsData } from '../data/invoice-form-custom-errors';

@Component({
  selector: 'app-invoice-form',
  imports: [
    ReactiveFormsModule,
    TextInput,
    NumberInput,
    DateInput,
    SignaturePad,
    Button
  ],
  templateUrl: './invoice-form.html',
  styleUrl: './invoice-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvoiceForm {
  fb = inject(FormBuilder);

  isFormSubmitted = signal(false);
  invoiceFormCustomErrorsData = signal(InvoiceFormCustomErrorsData);

  invoiceForm = this.fb.group({
    'fullName': new FormControl<string | null>(null, [ Validators.required ]),
    'email': new FormControl<string | null>(null, [ Validators.required, Validators.pattern(EMAIL_REGEX) ]),
    'phone': new FormControl<string | Date | null>(null, [ Validators.pattern(ISRAEL_MOBILE_PHONE_REGEX) ]),
    'invoiceNumber': new FormControl<string | null>(null, [ Validators.required, Validators.pattern(ALPHANUMERIC_REGEX) ]),
    'amount': new FormControl<string | null>(null, [ Validators.required, Validators.min(0) ]),
    'date': new FormControl<string | null>(null, [ Validators.required ]),
    'signature': new FormControl<string | null>(null, [ Validators.required ]),
  });

  onSubmit(): void {
    console.log(this.invoiceForm.value);
    this.isFormSubmitted.set(true);
    if (this.invoiceForm.valid) {
      // const traineeData: CreateTrainee = this.populateCreateTraineeData();
      // this.resetForm();
    }
  }
}
