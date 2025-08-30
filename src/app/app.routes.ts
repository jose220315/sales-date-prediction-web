import { Routes } from '@angular/router';
import { CustomersComponent } from './customers/customers.component';
import { ChartComponent } from './chart/chart.component';

export const routes: Routes = [
  { path: '', redirectTo: '/customers', pathMatch: 'full' },
  { path: 'customers', component: CustomersComponent },
  { path: 'chart', component: ChartComponent }
];
