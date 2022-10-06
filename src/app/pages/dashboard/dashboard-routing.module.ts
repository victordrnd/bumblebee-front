import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContainersComponent } from './containers/containers.component';
import { DashboardComponent } from './dashboard.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {
    path: "",
    component: DashboardComponent,
    children : [
      {
        path : '',
        component : HomeComponent
      },
      {
        path : "containers",
        component : ContainersComponent
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
