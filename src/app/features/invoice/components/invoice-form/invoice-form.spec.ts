import { ComponentFixture, TestBed, fakeAsync, tick, flushMicrotasks } from '@angular/core/testing';
import { provideNativeDateAdapter } from '@angular/material/core';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { of, Subject } from 'rxjs';

import { InvoiceForm } from './invoice-form';
import { InvoiceService } from '../../services/invoice/invoice.service';
import { InvoiceSubmissionResponse } from '../../interfaces/invoice-data.interface';
import { FileService } from '../../../../shared/services/file/file.service';

describe('InvoiceForm', () => {
  let component: InvoiceForm;
  let fixture: ComponentFixture<InvoiceForm>;
  let invoiceServiceSpy: jasmine.SpyObj<InvoiceService>;
  let fileServiceSpy: jasmine.SpyObj<FileService>;

  beforeEach(async () => {
    const invoiceSpy = jasmine.createSpyObj('InvoiceService', [ 'submitInvoice' ]);
    const fileSpy = jasmine.createSpyObj('FileService', [ 'saveFile' ]);

    await TestBed.configureTestingModule({
      providers: [
        provideNativeDateAdapter(),
        provideHttpClient(),
        provideAnimations(),
        provideToastr(),
        { provide: FileService, useValue: fileSpy }
      ]
    });

    TestBed.overrideComponent(InvoiceForm, {
      remove: {
        providers: [ InvoiceService ]
      },
      add: {
        providers: [
          { provide: InvoiceService, useValue: invoiceSpy }
        ]
      }
    });

    await TestBed.compileComponents();

    fixture = TestBed.createComponent(InvoiceForm);
    component = fixture.componentInstance;
    invoiceServiceSpy = fixture.debugElement.injector.get(InvoiceService) as jasmine.SpyObj<InvoiceService>;
    fileServiceSpy = TestBed.inject(FileService) as jasmine.SpyObj<FileService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not submit if form is invalid', () => {
    component.onSubmit();

    expect(component.isFormSubmitted()).toBe(true);
    expect(invoiceServiceSpy.submitInvoice).not.toHaveBeenCalled();
  });

  it('should submit form when valid', fakeAsync(() => {
    const mockResponse: InvoiceSubmissionResponse = {
      success: true,
      message: 'Success',
      invoiceId: 'INV-123'
    };
    const mockBlob = new Blob(['test'], { type: 'application/pdf' });
    invoiceServiceSpy.submitInvoice.and.returnValue(of({ response: mockResponse, pdfBlob: mockBlob }));

    component.invoiceForm.controls.fullName.setValue('John Doe');
    component.invoiceForm.controls.email.setValue('john@example.com');
    component.invoiceForm.controls.phone.setValue(null);
    component.invoiceForm.controls.invoiceNumber.setValue('INV001');
    component.invoiceForm.controls.amount.setValue(1000);
    component.invoiceForm.controls.date.setValue('2025-10-31');
    component.invoiceForm.controls.signature.setValue('data:image/png;base64,test');

    Object.keys(component.invoiceForm.controls).forEach(key => {
      component.invoiceForm.controls[key as keyof typeof component.invoiceForm.controls].markAsTouched();
      component.invoiceForm.controls[key as keyof typeof component.invoiceForm.controls].updateValueAndValidity();
    });

    fixture.detectChanges();
    flushMicrotasks();

    component.onSubmit();
    tick();

    expect(invoiceServiceSpy.submitInvoice).toHaveBeenCalled();
    expect(fileServiceSpy.saveFile).toHaveBeenCalledWith(mockBlob, 'invoice-INV001.pdf');
  }));

  it('should set isSubmitting to true during submission', () => {
    const mockResponse: InvoiceSubmissionResponse = {
      success: true,
      message: 'Success'
    };
    const mockBlob = new Blob(['test'], { type: 'application/pdf' });

    const subject = new Subject<{ response: InvoiceSubmissionResponse, pdfBlob: Blob }>();
    invoiceServiceSpy.submitInvoice.and.returnValue(subject.asObservable());

    component.invoiceForm.setValue({
      fullName: 'John Doe',
      email: 'john@example.com',
      phone: '0501234567',
      invoiceNumber: 'INV001',
      amount: 1000,
      date: '2025-10-31',
      signature: 'data:image/png;base64,test'
    });
    fixture.detectChanges();

    component.onSubmit();

    expect(component.isSubmitting()).toBe(true);

    subject.next({ response: mockResponse, pdfBlob: mockBlob });
    subject.complete();

    expect(component.isSubmitting()).toBe(false);
  });

  it('should reset form on successful submission', fakeAsync(() => {
    const mockResponse: InvoiceSubmissionResponse = {
      success: true,
      message: 'Success'
    };
    const mockBlob = new Blob(['test'], { type: 'application/pdf' });
    invoiceServiceSpy.submitInvoice.and.returnValue(of({ response: mockResponse, pdfBlob: mockBlob }));

    component.invoiceForm.controls.fullName.setValue('John Doe');
    component.invoiceForm.controls.email.setValue('john@example.com');
    component.invoiceForm.controls.phone.setValue(null);
    component.invoiceForm.controls.invoiceNumber.setValue('INV001');
    component.invoiceForm.controls.amount.setValue(1000);
    component.invoiceForm.controls.date.setValue('2025-10-31');
    component.invoiceForm.controls.signature.setValue('data:image/png;base64,test');

    Object.keys(component.invoiceForm.controls).forEach(key => {
      component.invoiceForm.controls[key as keyof typeof component.invoiceForm.controls].markAsTouched();
      component.invoiceForm.controls[key as keyof typeof component.invoiceForm.controls].updateValueAndValidity();
    });

    fixture.detectChanges();
    flushMicrotasks();

    component.onSubmit();
    tick();

    expect(component.invoiceForm.value.fullName).toBeNull();
    expect(component.isFormSubmitted()).toBe(false);
  }));

});
