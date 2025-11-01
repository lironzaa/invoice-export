import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { NumberInput } from './number-input';

@Component({
  template: `
    <app-number-input [formControl]="control" name="testNumber"></app-number-input>`,
  imports: [ ReactiveFormsModule, NumberInput ]
})
class TestComponent {
  control = new FormControl();
}

describe('NumberInput', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ TestComponent ]
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
