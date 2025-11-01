import { Injectable, inject } from '@angular/core';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { InvoiceFormData, InvoiceSubmissionResponse } from '../../interfaces/invoice-data.interface';
import { PdfGeneratorService } from '../../../../shared/services/pdf-generator/pdf-generator.service';
import { PdfDocumentData } from '../../../../shared/interfaces/pdf-config.interface';
import { formatDate } from '../../../../shared/utils/date-utils';
import { ApiService } from '../../../../shared/services/api/api.service';

@Injectable()
export class InvoiceService {
  private apiService = inject(ApiService);
  private pdfGenerator = inject(PdfGeneratorService);
  private readonly API_URL = '/api/invoices';

  submitInvoice(invoiceData: InvoiceFormData): Observable<{ response: InvoiceSubmissionResponse, pdfBlob: Blob }> {
    const pdfData = this.preparePdfData(invoiceData);
    const pdfBlob = this.pdfGenerator.generatePDF(pdfData);

    const formData = new FormData();
    formData.append('invoiceData', JSON.stringify(invoiceData));
    formData.append('pdfFile', pdfBlob, `invoice-${invoiceData.invoiceNumber}.pdf`);

    return from(this.apiService.post<InvoiceSubmissionResponse>(this.API_URL, formData))
      .pipe(
        map(response => ({ response, pdfBlob }))
      );
  }

  private preparePdfData(invoiceData: InvoiceFormData): PdfDocumentData {
    return {
      title: 'Invoice Document',
      sections: [
        {
          title: 'Personal Details',
          fields: [
            { label: 'Full Name', value: invoiceData.fullName },
            { label: 'Email', value: invoiceData.email },
            { label: 'Phone', value: invoiceData.phone }
          ]
        },
        {
          title: 'Invoice Details',
          fields: [
            { label: 'Invoice Number', value: invoiceData.invoiceNumber },
            { label: 'Amount', value: `${ invoiceData.amount }$` },
            { label: 'Date', value: formatDate(invoiceData.date) }
          ]
        }
      ],
      signature: invoiceData.signature
    };
  }
}