import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';

import { InvoiceSubmissionResponse } from '../../features/invoice/interfaces/invoice-data.interface';

export const mockBackendInterceptor: HttpInterceptorFn = (req, next) => {
  const { url, method } = req;

  if (url.includes('/api/invoices') && method === 'POST') {

    const response: InvoiceSubmissionResponse = {
      success: true,
      message: 'Invoice submitted successfully',
      invoiceId: `INV-${Date.now()}`
    };

    return of(new HttpResponse({
      status: 200,
      body: response
    }));
  }

  return next(req);
};