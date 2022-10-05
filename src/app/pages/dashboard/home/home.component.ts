import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { EndpointsService } from 'src/app/core/services/endpoints.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  endpoints: any[] = [];
  loading : boolean = true;
  constructor(private endpointService: EndpointsService,
    private router: Router) { }
  
  ngOnInit() {
    this.getEndpoints()
  }


  async getEndpoints() {
    this.loading = true;
    this.endpoints = await firstValueFrom(this.endpointService.list());
    this.loading = false;
  }

  chooseEnvironment(endpoint: any) {
    this.endpointService.setCurrentEnv(endpoint)
    this.router.navigate([`/dashboard/containers`]);
  }
}
