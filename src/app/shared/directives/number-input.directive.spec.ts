import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { NumberInputValueAccessorDirective } from './number-input.directive';

@Component({
  template: `<input type="number" [formControl]="control" appNumberInputValueAccessorDirective>`,
  imports: [ReactiveFormsModule, NumberInputValueAccessorDirective]
})
class TestComponent {
  control = new FormControl();
}

describe('NumberInputDirective', () => {
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
