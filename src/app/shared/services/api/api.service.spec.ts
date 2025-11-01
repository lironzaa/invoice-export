import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';

import { ApiService } from './api.service';
import { AppToastrService } from '../toastr/toastr.service';
import { ToastrTypeEnum } from '../../enums/toastr/toastr-type.enum';

describe('ApiService', () => {
  let service: ApiService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let toastrSpy: jasmine.SpyObj<AppToastrService>;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['post']);
    toastrSpy = jasmine.createSpyObj('AppToastrService', ['showToastr']);

    TestBed.configureTestingModule({
      providers: [
        ApiService,
        { provide: HttpClient, useValue: httpClientSpy },
        { provide: AppToastrService, useValue: toastrSpy }
      ]
    });

    service = TestBed.inject(ApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('post', () => {
    it('should return response on successful POST request', async () => {
      const mockResponse = { id: 1, message: 'Success' };
      httpClientSpy.post.and.returnValue(of(mockResponse));

      const result = await service.post('/api/test', { data: 'test' });

      expect(result).toEqual(mockResponse);
      expect(httpClientSpy.post).toHaveBeenCalledWith('/api/test', { data: 'test' });
      expect(toastrSpy.showToastr).not.toHaveBeenCalled();
    });

    it('should throw HttpErrorResponse and show toastr', async () => {
      const mockError = new HttpErrorResponse({
        error: { message: 'Server error' },
        status: 500,
        statusText: 'Internal Server Error'
      });
      httpClientSpy.post.and.returnValue(throwError(() => mockError));

      await expectAsync(service.post('/api/test', { data: 'test' })).toBeRejected();

      expect(toastrSpy.showToastr).toHaveBeenCalledWith(
        'Server error',
        ToastrTypeEnum.Error
      );
    });

    it('should throw HttpErrorResponse without error message', async () => {
      const mockError = new HttpErrorResponse({
        status: 404,
        statusText: 'Not Found'
      });
      httpClientSpy.post.and.returnValue(throwError(() => mockError));

      await expectAsync(service.post('/api/test')).toBeRejected();

      expect(toastrSpy.showToastr).toHaveBeenCalledWith(
        'An error occurred. Please try again or contact support if the issue continues.',
        ToastrTypeEnum.Error
      );
    });

    it('should throw unknown error type', async () => {
      const unknownError = new Error('Unknown error');
      httpClientSpy.post.and.returnValue(throwError(() => unknownError));

      await expectAsync(service.post('/api/test')).toBeRejected();

      expect(toastrSpy.showToastr).toHaveBeenCalledWith(
        'An unexpected error occurred. Please try again or contact support.',
        ToastrTypeEnum.Error
      );
    });
  });
});