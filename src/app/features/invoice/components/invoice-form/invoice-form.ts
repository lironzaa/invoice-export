import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal, viewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs/operators';

import { ALPHANUMERIC_REGEX, EMAIL_REGEX, ISRAEL_MOBILE_PHONE_REGEX } from '../../../../shared/regex/regex';
import { TextInput } from '../../../../shared/components/inputs/text-input/text-input';
import { NumberInput } from '../../../../shared/components/inputs/number-input/number-input';
import { DateInput } from '../../../../shared/components/inputs/date-input/date-input';
import { SignaturePad } from '../../../../shared/components/signature-pad/signature-pad';
import { Button } from '../../../../shared/components/buttons/button/button';
import { InvoiceFormCustomErrorsData } from '../data/invoice-form-custom-errors';
import { InvoiceService } from '../../services/invoice/invoice.service';
import { InvoiceFormData } from '../../interfaces/invoice-data.interface';
import { LoadingService } from '../../../../shared/services/loading/loading.service';
import { AppToastrService } from '../../../../shared/services/toastr/toastr.service';
import { ToastrTypeEnum } from '../../../../shared/enums/toastr/toastr-type.enum';
import { FileService } from '../../../../shared/services/file/file.service';

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
  providers: [ InvoiceService ]
})
export class InvoiceForm {
  private fb = inject(FormBuilder);
  private invoiceService = inject(InvoiceService);
  private destroyRef = inject(DestroyRef);
  private loadingService = inject(LoadingService);
  private toastrService = inject(AppToastrService);
  private fileService = inject(FileService);

  isFormSubmitted = signal(false);
  isSubmitting = signal(false);
  invoiceFormCustomErrorsData = signal(InvoiceFormCustomErrorsData);

  invoiceForm = this.fb.group({
    'fullName': new FormControl<string | null>(null, [ Validators.required ]),
    'email': new FormControl<string | null>(null, [ Validators.required, Validators.pattern(EMAIL_REGEX) ]),
    'phone': new FormControl<string | null>(null, [ Validators.pattern(ISRAEL_MOBILE_PHONE_REGEX) ]),
    'invoiceNumber': new FormControl<string | null>(null, [ Validators.required, Validators.pattern(ALPHANUMERIC_REGEX) ]),
    'amount': new FormControl<number | null>(null, [ Validators.required, Validators.min(0) ]),
    'date': new FormControl<string | Date | null>(null, [ Validators.required ]),
    'signature': new FormControl<string | null>(null, [ Validators.required ]),
  });

  invoiceFormDirective = viewChild.required<FormGroupDirective>('invoiceFormDirective');

  onSubmit(): void {
    this.isFormSubmitted.set(true);

    if (!this.invoiceForm.valid) {
      return;
    }

    const formData = this.getFormData();
    if (!formData) {
      return;
    }

    this.isSubmitting.set(true);
    this.loadingService.setLoading(true);

    this.invoiceService.submitInvoice(formData)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.isSubmitting.set(false);
          this.loadingService.setLoading(false);
        })
      )
      .subscribe((result) => {
        this.toastrService.showToastr(
          result.response.message || 'Invoice submitted successfully!',
          ToastrTypeEnum.Success
        );
        this.fileService.saveFile(result.pdfBlob, `invoice-${formData.invoiceNumber}.pdf`);
        this.resetForm();
      });
  }

  getFormData(): InvoiceFormData | null {
    const formValue = this.invoiceForm.value;

    if (!formValue.fullName || !formValue.email || !formValue.invoiceNumber || !formValue.amount || !formValue.date || !formValue.signature) {
      this.toastrService.showToastr('Form data is incomplete. Please fill all required fields.', ToastrTypeEnum.Error);
      return null;
    }

    return {
      fullName: formValue.fullName,
      email: formValue.email,
      phone: formValue.phone || null,
      invoiceNumber: formValue.invoiceNumber,
      amount: formValue.amount,
      date: typeof formValue.date === 'string' ? formValue.date : formValue.date.toISOString(),
      signature: formValue.signature
    };
  }

  resetForm(): void {
    this.invoiceFormDirective().resetForm();
    this.isFormSubmitted.set(false);
  }
}
