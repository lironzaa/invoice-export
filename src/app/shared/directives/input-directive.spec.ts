import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { ControlValueAccessorDirective } from './input.directive';

@Component({
  template: `<input [formControl]="control" appControlValueAccessorDirective>`,
  imports: [ReactiveFormsModule, ControlValueAccessorDirective]
})
class TestComponent {
  control = new FormControl();
}

describe('InputDirectiveDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });
});
