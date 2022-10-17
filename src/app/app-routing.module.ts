import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { StatsComponent } from './pages/stats/stats.component';

const routes: Routes = [
  {
    path : "",
    component : HomeComponent
  },
  {
    path : 'stats/:id',
    component : StatsComponent
  },
  {
    path : 'login',
    component : LoginComponent
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
