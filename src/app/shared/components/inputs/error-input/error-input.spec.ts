import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';

import { ErrorInput } from './error-input';

describe('ErrorInput', () => {
  let component: ErrorInput;
  let fixture: ComponentFixture<ErrorInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ErrorInput ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ErrorInput);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('control', new FormControl());
    fixture.componentRef.setInput('controlName', 'testControl');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
