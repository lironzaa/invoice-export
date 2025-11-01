import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';

import { InvoiceService } from './invoice.service';
import { PdfGeneratorService } from '../../../../shared/services/pdf-generator/pdf-generator.service';
import { InvoiceFormData, InvoiceSubmissionResponse } from '../../interfaces/invoice-data.interface';
import { ApiService } from '../../../../shared/services/api/api.service';

describe('InvoiceService', () => {
  let service: InvoiceService;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;
  let pdfGeneratorService: PdfGeneratorService;

  const mockFormData: InvoiceFormData = {
    fullName: 'John Doe',
    email: 'john@example.com',
    phone: '0501234567',
    invoiceNumber: 'INV-001',
    amount: 1000,
    date: '2025-10-31',
    signature: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
  };

  beforeEach(() => {
    const apiSpy = jasmine.createSpyObj('ApiService', [ 'post' ]);

    TestBed.configureTestingModule({
      providers: [
        InvoiceService,
        PdfGeneratorService,
        { provide: ApiService, useValue: apiSpy }
      ]
    });
    service = TestBed.inject(InvoiceService);
    apiServiceSpy = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    pdfGeneratorService = TestBed.inject(PdfGeneratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should generate PDF and submit invoice with FormData', (done) => {
    const mockResponse: InvoiceSubmissionResponse = {
      success: true,
      message: 'Invoice submitted successfully',
      invoiceId: 'INV-123'
    };
    apiServiceSpy.post.and.resolveTo(mockResponse);

    service.submitInvoice(mockFormData).subscribe(response => {
      expect(response.response).toEqual(mockResponse);
      expect(response.response.success).toBe(true);
      expect(response.response.invoiceId).toBe('INV-123');
      expect(response.pdfBlob).toBeInstanceOf(Blob);
      expect(response.pdfBlob.type).toBe('application/pdf');

      expect(apiServiceSpy.post).toHaveBeenCalledWith('/api/invoices', jasmine.any(FormData));
      done();
    });
  });

  it('should handle HTTP error response', (done) => {
    const mockError = new HttpErrorResponse({
      status: 500,
      statusText: 'Internal Server Error',
      error: { message: 'Server error occurred' }
    });
    apiServiceSpy.post.and.rejectWith(mockError);

    service.submitInvoice(mockFormData).subscribe({
      next: () => fail('should have failed with error'),
      error: (error) => {
        expect(error.status).toBe(500);
        expect(error.statusText).toBe('Internal Server Error');
        done();
      }
    });
  });

  it('should call apiService.post with correct parameters', (done) => {
    const mockResponse: InvoiceSubmissionResponse = {
      success: true,
      message: 'Success'
    };
    apiServiceSpy.post.and.resolveTo(mockResponse);

    service.submitInvoice(mockFormData).subscribe(() => {
      const callArgs = apiServiceSpy.post.calls.mostRecent().args;
      expect(callArgs[0]).toBe('/api/invoices');
      expect(callArgs[1]).toBeInstanceOf(FormData);

      const formData = callArgs[1] as FormData;
      expect(formData.has('invoiceData')).toBe(true);
      expect(formData.has('pdfFile')).toBe(true);

      const pdfFile = formData.get('pdfFile') as Blob;
      expect(pdfFile.type).toBe('application/pdf');

      done();
    });
  });

  it('should serialize invoice data as JSON string in FormData', (done) => {
    const mockResponse: InvoiceSubmissionResponse = {
      success: true,
      message: 'Success'
    };
    apiServiceSpy.post.and.resolveTo(mockResponse);

    service.submitInvoice(mockFormData).subscribe(() => {
      const formData = apiServiceSpy.post.calls.mostRecent().args[1] as FormData;
      const invoiceDataString = formData.get('invoiceData') as string;
      const parsedData = JSON.parse(invoiceDataString);

      expect(parsedData).toEqual(mockFormData);
      expect(parsedData.fullName).toBe('John Doe');
      expect(parsedData.invoiceNumber).toBe('INV-001');

      done();
    });
  });
});