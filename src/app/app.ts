import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Header } from './core/components/layout/header/header';
import { LoadingService } from './shared/services/loading/loading.service';
import { Spinner } from './shared/components/spinner/spinner';
import { SpinnerEnum } from './shared/enums/spinner/spinner.enum';

@Component({
  selector: 'app-root',
  imports: [ RouterOutlet, Header, Spinner ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  loadingService = inject(LoadingService);

  protected readonly title = signal('invoice-export');
  isLoading = this.loadingService.isLoading;
  SpinnerEnum = SpinnerEnum;
}
