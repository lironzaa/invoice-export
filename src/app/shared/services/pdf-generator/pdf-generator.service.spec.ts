import { TestBed } from '@angular/core/testing';

import { PdfGeneratorService } from './pdf-generator.service';
import { PdfDocumentData } from '../../interfaces/pdf-config.interface';

describe('PdfGeneratorService', () => {
  let service: PdfGeneratorService;
  const mockPdfData: PdfDocumentData = {
    title: 'Test Document',
    sections: [
      {
        title: 'Personal Details',
        fields: [
          { label: 'Full Name', value: 'John Doe' },
          { label: 'Email', value: 'john@example.com' },
          { label: 'Phone', value: '0501234567' }
        ]
      },
      {
        title: 'Invoice Details',
        fields: [
          { label: 'Invoice Number', value: 'INV-001' },
          { label: 'Amount', value: '1000$' },
          { label: 'Date', value: 'October 31, 2025' }
        ]
      }
    ],
    signature: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PdfGeneratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should generate PDF blob from data', () => {
    const pdfBlob = service.generatePDF(mockPdfData);

    expect(pdfBlob).toBeInstanceOf(Blob);
    expect(pdfBlob.type).toBe('application/pdf');
    expect(pdfBlob.size).toBeGreaterThan(0);
  });

  it('should handle null field values', () => {
    const dataWithNullValue: PdfDocumentData = {
      title: 'Test',
      sections: [
        {
          title: 'Test Section',
          fields: [
            { label: 'Field 1', value: 'Value 1' },
            { label: 'Field 2', value: null }
          ]
        }
      ]
    };

    const pdfBlob = service.generatePDF(dataWithNullValue);

    expect(pdfBlob).toBeInstanceOf(Blob);
    expect(pdfBlob.type).toBe('application/pdf');
  });

  it('should handle invalid signature gracefully', () => {
    const dataWithInvalidSignature: PdfDocumentData = {
      ...mockPdfData,
      signature: 'invalid-base64-data'
    };

    const pdfBlob = service.generatePDF(dataWithInvalidSignature);

    expect(pdfBlob).toBeInstanceOf(Blob);
    expect(pdfBlob.type).toBe('application/pdf');
  });

  it('should generate PDF without signature', () => {
    const dataWithoutSignature: PdfDocumentData = {
      title: 'Test Document',
      sections: mockPdfData.sections
    };

    const pdfBlob = service.generatePDF(dataWithoutSignature);

    expect(pdfBlob).toBeInstanceOf(Blob);
    expect(pdfBlob.type).toBe('application/pdf');
  });
});