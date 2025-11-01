import { TestBed } from '@angular/core/testing';
import { provideToastr } from 'ngx-toastr';

import { AppToastrService } from './toastr.service';

describe('AppToastrService', () => {
  let service: AppToastrService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideToastr()]
    });
    service = TestBed.inject(AppToastrService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
