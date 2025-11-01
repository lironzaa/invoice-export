import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { AppToastrService } from '../toastr/toastr.service';
import { ToastrTypeEnum } from '../../enums/toastr/toastr-type.enum';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private toastrService = inject(AppToastrService);

  async post<T>(url: string, body?: unknown): Promise<T> {
    try {
      return await firstValueFrom(
        this.http.post<T>(url, body)
      );
    } catch (err: unknown) {
      this.handleError(err);
      throw err;
    }
  }

  private handleError(error: unknown, customMessage?: string): void {
    console.error('API Error:', error);

    if (error instanceof HttpErrorResponse) {
      const message = customMessage || error.error?.message || 'An error occurred. Please try again or contact support if the issue continues.';
      this.toastrService.showToastr(message, ToastrTypeEnum.Error);
    } else {
      const message = customMessage || 'An unexpected error occurred. Please try again or contact support.';
      this.toastrService.showToastr(message, ToastrTypeEnum.Error);
    }
  }
}