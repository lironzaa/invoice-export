import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { SpinnerSizeType } from '../../types/spinner/spinner.type';
import { SpinnerEnum } from '../../enums/spinner/spinner.enum';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.html',
  styleUrl: './spinner.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ MatProgressSpinnerModule ]
})
export class Spinner {
  size = input<SpinnerSizeType>(SpinnerEnum.MD);

  diameter = computed(() => {
    switch (this.size()) {
      case SpinnerEnum.SM:
        return 24;
      case SpinnerEnum.MD:
        return 40;
      case SpinnerEnum.LG:
        return 64;
      case SpinnerEnum.XL:
        return 96;
      default:
        return 40;
    }
  });
}
