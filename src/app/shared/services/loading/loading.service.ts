import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  #loading = signal(false);
  isLoading = this.#loading.asReadonly();

  setLoading(isLoading: boolean): void {
    this.#loading.set(isLoading);
  }
}
