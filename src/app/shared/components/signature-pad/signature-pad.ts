import { ChangeDetectionStrategy, Component, forwardRef, input, viewChild, ElementRef, AfterViewInit, OnDestroy, effect } from '@angular/core';
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import SignaturePadLib from 'signature_pad';

import { ControlValueAccessorDirective } from '../../directives/input.directive';
import { ErrorInput } from '../inputs/error-input/error-input';
import { CustomErrorMessages } from '../../types/inputs/error-input/custom-error-messages.type';

@Component({
  selector: 'app-signature-pad',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SignaturePad),
      multi: true,
    },
  ],
  templateUrl: './signature-pad.html',
  styleUrls: ['./signature-pad.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    NgClass,
    ErrorInput,
    MatIconButton,
    MatIcon,
  ],
})
export class SignaturePad extends ControlValueAccessorDirective<string | null> implements AfterViewInit, OnDestroy {
  name = input.required<string>();
  label = input<string>();
  customErrorMessages = input<CustomErrorMessages>({});
  isFormSubmitted = input(false);
  formFieldClass = input<string>('');
  canvasWidth = input<number>(500);
  canvasHeight = input<number>(200);

  canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('signatureCanvas');

  private signaturePadInstance: SignaturePadLib | null = null;
  private pendingValue: string | null = null;

  constructor() {
    super();

    effect(() => {
      const ctrl = this.control();
      const pad = this.signaturePadInstance;

      if (!pad) {
        return;
      }

      if (ctrl?.disabled) {
        pad.off();
      } else {
        pad.on();
      }
    });
  }

  ngAfterViewInit(): void {
    this.initializeSignaturePad();

    if (this.pendingValue) {
      this.applyPendingValue();
    }
  }

  ngOnDestroy(): void {
    if (this.signaturePadInstance) {
      this.signaturePadInstance.off();
      this.signaturePadInstance = null;
    }
  }

  private initializeSignaturePad(): void {
    const canvas = this.canvasRef().nativeElement;

    this.setupCanvas(canvas);

    this.signaturePadInstance = new SignaturePadLib(canvas, {
      minWidth: 1,
      maxWidth: 3,
      backgroundColor: 'rgb(255, 255, 255)',
      penColor: 'rgb(0, 0, 0)',
    });

    this.signaturePadInstance.addEventListener('endStroke', () => {
      this.onDrawEnd();
    });
  }

  private setupCanvas(canvas: HTMLCanvasElement): void {
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    const width = this.canvasWidth();
    const height = this.canvasHeight();

    canvas.width = width * ratio;
    canvas.height = height * ratio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const context = canvas.getContext('2d');
    if (context) {
      context.scale(ratio, ratio);
    }
  }

  override writeValue(value: string | null): void {
    super.writeValue(value);

    if (!this.signaturePadInstance) {
      this.pendingValue = value;
      return;
    }

    this.applyValue(value);
  }

  private applyValue(value: string | null): void {
    if (!this.signaturePadInstance) {
      return;
    }

    if (value) {
      this.signaturePadInstance.fromDataURL(value);
    } else {
      this.signaturePadInstance.clear();
    }
  }

  private applyPendingValue(): void {
    if (this.pendingValue !== null) {
      this.applyValue(this.pendingValue);
      this.pendingValue = null;
    }
  }

  onDrawEnd(): void {
    if (!this.signaturePadInstance) {
      return;
    }

    const isEmpty = this.signaturePadInstance.isEmpty();
    const dataURL = isEmpty ? null : this.signaturePadInstance.toDataURL('image/png');

    this.control().setValue(dataURL);
    this.onBlur();
  }

  clear(): void {
    if (!this.signaturePadInstance) {
      return;
    }

    this.signaturePadInstance.clear();
    this.control().setValue(null);
    this.onBlur();
  }
}