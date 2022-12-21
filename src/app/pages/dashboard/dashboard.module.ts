import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzCardModule } from 'ng-zorro-antd/card';
import { ContainersComponent } from './containers/containers.component';
import { HomeComponent } from './home/home.component';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { ContainerLogsComponent } from './containers/container-logs/container-logs.component';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RenameContainerModalComponent } from './containers/_components/rename-container-modal/rename-container-modal.component';
import { NzInputModule } from 'ng-zorro-antd/input';
import { EndpointsComponent } from './endpoints/endpoints.component';
import { EditEndpointComponent } from './endpoints/_components/edit-endpoint/edit-endpoint.component';
import { NzSegmentedModule } from 'ng-zorro-antd/segmented';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { ContainerTerminalComponent } from './containers/container-terminal/container-terminal.component';
import { ContainerStatsComponent } from './containers/container-stats/container-stats.component';
import { NgChartsModule } from 'ng2-charts';
import { UsersComponent } from './users/users.component';
import { CreateUserModalComponent } from './users/_component/create-user-modal/create-user-modal.component';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { HttpCacheInterceptorModule } from '@ngneat/cashew';
import { ImagesComponent } from './images/images.component';
import { FileSizePipe } from 'src/app/core/pipes/file-size.pipe';
import { PipeModule } from 'src/app/core/pipes/pipe.module';
import { ImagePullModalComponent } from './images/_components/image-pull-modal/image-pull-modal.component';
import { VolumesComponent } from './volumes/volumes.component';
import { NetworksComponent } from './networks/networks.component';
import { NzBytesPipe, NzPipesModule } from 'ng-zorro-antd/pipes';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { ContainerCreateComponent } from './containers/container-create/container-create.component';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { SitesComponent } from './sites/sites.component';
import { AppModule } from 'src/app/app.module';
import { SiteCreateModalComponent } from './sites/_components/site-create-modal/site-create-modal.component';
import { ContainerFsComponent } from './containers/container-fs/container-fs.component';
import { ReverseProxyComponent } from './reverse-proxy/reverse-proxy.component';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { RegistriesComponent } from './registries/registries.component';
import { CreateRegistryModalComponent } from './registries/_components/create-registry-modal/create-registry-modal.component';
import { DnsComponent } from './dns/dns.component';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
@NgModule({
  declarations: [
    DashboardComponent,
    ContainersComponent,
    HomeComponent,
    ContainerLogsComponent,
    RenameContainerModalComponent,
    EndpointsComponent,
    EditEndpointComponent,
    ContainerTerminalComponent,
    ContainerStatsComponent,
    UsersComponent,
    CreateUserModalComponent,
    ImagesComponent,
    ImagePullModalComponent,
    VolumesComponent,
    NetworksComponent,
    ContainerCreateComponent,
    SitesComponent,
    SiteCreateModalComponent,
    ContainerFsComponent,
    ReverseProxyComponent,
    RegistriesComponent,
    CreateRegistryModalComponent,
    DnsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DashboardRoutingModule,
    NzLayoutModule,
    NzMenuModule,
    NzIconModule,
    NzCardModule,
    NzTagModule,
    NzButtonModule,
    NzSelectModule,
    NzSpinModule,
    NzTableModule,
    NzPageHeaderModule,
    NzNotificationModule,
    NzModalModule,
    NzInputModule,
    NzSegmentedModule,
    NzSwitchModule,
    NzRadioModule,
    NzUploadModule,
    NgChartsModule,
    NzPopconfirmModule,
    HttpCacheInterceptorModule,
    PipeModule,
    NzPipesModule,
    NzToolTipModule,
    NzFormModule,
    NzDividerModule,
    NzInputNumberModule,
    NzTabsModule,
    NzAlertModule,
    NzStepsModule,
    NzSliderModule,
    NzBadgeModule
  ],
  providers : [FileSizePipe, NzBytesPipe],
  exports: [DashboardComponent]
})
export class DashboardModule { }
