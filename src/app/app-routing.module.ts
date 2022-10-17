import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ChartComponent} from './pages/home/_components/chart/chart.component';
import { StatusComponent} from './pages/home/_components/status/status.component';
import { StatsComponent } from './pages/home/_components/stats/stats.component';

const routes: Routes = [
  {
    path : "",
    component : HomeComponent, 
  },
  {
    path : 'stats/:id',
    component : StatsComponent
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
