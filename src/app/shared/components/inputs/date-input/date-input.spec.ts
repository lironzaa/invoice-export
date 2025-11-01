import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';

import { DateInput } from './date-input';

@Component({
  template: `
    <app-date-input [formControl]="control" name="testDate"></app-date-input>`,
  imports: [ ReactiveFormsModule, DateInput ]
})
class TestComponent {
  control = new FormControl();
}

describe('DateInput', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ TestComponent ],
      providers: [ provideNativeDateAdapter() ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
