import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { SignaturePad } from './signature-pad';

@Component({
  template: `
    <app-signature-pad [formControl]="control" name="testSignature"></app-signature-pad>`,
  imports: [ ReactiveFormsModule, SignaturePad ]
})
class TestComponent {
  control = new FormControl();
}

describe('SignaturePad', () => {
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