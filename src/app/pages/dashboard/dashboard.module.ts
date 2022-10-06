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
@NgModule({
  declarations: [
    DashboardComponent,
    ContainersComponent,
    HomeComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    NzLayoutModule,
    NzMenuModule,
    NzIconModule,
    NzCardModule,
    NzTagModule,
    NzButtonModule,
    NzSpinModule,
    NzTableModule,
    NzPageHeaderModule
  ],
  exports: [DashboardComponent]
})
export class DashboardModule { }
