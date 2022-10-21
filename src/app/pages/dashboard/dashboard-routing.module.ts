import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContainerLogsComponent } from './containers/container-logs/container-logs.component';
import { ContainerStatsComponent } from './containers/container-stats/container-stats.component';
import { ContainerTerminalComponent } from './containers/container-terminal/container-terminal.component';
import { ContainersComponent } from './containers/containers.component';
import { DashboardComponent } from './dashboard.component';
import { EndpointsComponent } from './endpoints/endpoints.component';
import { HomeComponent } from './home/home.component';
import { ImagesComponent } from './images/images.component';
import { UsersComponent } from './users/users.component';

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
        children : [
          {
            path : "",
            component : ContainersComponent
          },
          {
            path : ":id/logs",
            component : ContainerLogsComponent
          },
          {
            path : ":id/terminal",
            component : ContainerTerminalComponent
          },
          {
            path : ":id/stats",
            component : ContainerStatsComponent
          }
        ]
      },
      {
        path : "images",
        children : [
          {
            path :"",
            component : ImagesComponent
          }
        ]
      },
      {
        path : 'settings',
        children : [
          {
            path : "endpoints",
            component : EndpointsComponent
          },
          {
            path : "users",
            component : UsersComponent
          }
        ]
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
