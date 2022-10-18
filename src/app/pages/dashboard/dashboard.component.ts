import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom, Subscription } from 'rxjs';
import { EndpointsService } from 'src/app/core/services/endpoints.service';
import { UsersService } from 'src/app/core/services/users.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  mobile: boolean = false;
  currentEnvironment :any = null;
  subscriptions : Subscription[]= [];
  constructor(public endpointService: EndpointsService,
    private router : Router,
    private userService : UsersService) { }
  

  ngOnInit(): void {
    if (navigator.userAgent.match(/Android/i)
      || navigator.userAgent.match(/webOS/i)
      || navigator.userAgent.match(/iPhone/i)
      || navigator.userAgent.match(/iPad/i)
      || navigator.userAgent.match(/iPod/i)) {
      this.mobile = true;
    }
    const sb = this.endpointService.currentEnv.subscribe(e => {
      this.currentEnvironment = e
    });
    this.subscriptions.push(sb);
  }


  async signout(){
    const res = await this.userService.signOut();
    this.router.navigate(['login']);
  }

  ngOnDestroy(): void {
   this.subscriptions.map(s => s.unsubscribe())
  }

}
