import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/invoice-form',
    pathMatch: 'full'
  },
  {
    path: 'invoice-form',
    loadComponent: () => import('./features/invoice/components/invoice-form/invoice-form').then(i => i.InvoiceForm)
  },
];
