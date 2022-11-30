import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContainerCreateComponent } from './containers/container-create/container-create.component';
import { ContainerFsComponent } from './containers/container-fs/container-fs.component';
import { ContainerLogsComponent } from './containers/container-logs/container-logs.component';
import { ContainerStatsComponent } from './containers/container-stats/container-stats.component';
import { ContainerTerminalComponent } from './containers/container-terminal/container-terminal.component';
import { ContainersComponent } from './containers/containers.component';
import { DashboardComponent } from './dashboard.component';
import { EndpointsComponent } from './endpoints/endpoints.component';
import { HomeComponent } from './home/home.component';
import { ImagesComponent } from './images/images.component';
import { NetworksComponent } from './networks/networks.component';
import { RegistriesComponent } from './registries/registries.component';
import { ReverseProxyComponent } from './reverse-proxy/reverse-proxy.component';
import { SitesComponent } from './sites/sites.component';
import { UsersComponent } from './users/users.component';
import { VolumesComponent } from './volumes/volumes.component';

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
            path : "create",
            component : ContainerCreateComponent
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
          },
          {
            path : ":id/fs",
            component : ContainerFsComponent
          },
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
        path : "volumes",
        children : [
          {
            path : "",
            component : VolumesComponent
          }
        ]
      },
      {
        path : "reverse-proxy",
        children : [
          {
            path : "",
            component : ReverseProxyComponent
          }
        ]
      },
      {
        path : "networks",
        children : [
          {
            path : "",
            component : NetworksComponent
          }
        ]
      },
      {
        path :"sites",
        component : SitesComponent
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
          },
          {
            path : "registries",
            component : RegistriesComponent
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
