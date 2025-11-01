import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { TextInput } from './text-input';

@Component({
  template: `
    <app-text-input [formControl]="control" name="testText"></app-text-input>`,
  imports: [ ReactiveFormsModule, TextInput ]
})
class TestComponent {
  control = new FormControl();
}

describe('TextInput', () => {
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
