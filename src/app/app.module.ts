import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/header/header.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { fr_FR } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import fr from '@angular/common/locales/fr';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StatsComponent } from './pages/home/_components/stats/stats.component';
import { HomeComponent } from './pages/home/home.component';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { environment } from 'src/environments/environment';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { ChartComponent } from './pages/home/_components/chart/chart.component';
import { StatusComponent } from './pages/home/_components/status/status.component';
import { NgChartsModule } from 'ng2-charts';
import { LoginComponent } from './pages/login/login.component';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { HttpCacheInterceptorModule } from '@ngneat/cashew';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { FileSizePipe } from 'src/app/core/pipes/file-size.pipe';
import { PipeModule } from './core/pipes/pipe.module';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { HttpTokenInterceptor } from './core/interceptors/http.token.interceptor';
registerLocaleData(fr);
const config: SocketIoConfig = { url: environment.socketServer, options: { transports: ['websocket'], autoConnect: false, query : {authorization : 'Bearer '+localStorage.getItem('token')}}};
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    StatsComponent,
    HomeComponent,
    ChartComponent,
    StatusComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    PipeModule,
    NzLayoutModule,
    BrowserAnimationsModule,
    NzButtonModule,
    NzInputModule,
    NzIconModule,
    NzProgressModule,
    SocketIoModule.forRoot(config),
    NzTagModule,
    NzCardModule,
    NgChartsModule,
    NzNotificationModule,
    HttpCacheInterceptorModule.forRoot(),
    NzTypographyModule,
    NzDividerModule
  ],
  providers: [
    { provide: NZ_I18N, useValue: fr_FR },
    { provide: HTTP_INTERCEPTORS, useClass: HttpTokenInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
