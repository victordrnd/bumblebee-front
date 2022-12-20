import { Component, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { SitesService } from 'src/app/core/services/sites.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  sites : any= [];
  currentSite? : any;

  constructor(private siteService : SitesService) { }

  async ngOnInit() {
    this.sites = await firstValueFrom(this.siteService.findAll())
    this.sites = this.sites.map((s:any) => {s.disponibility = Math.round(s.disponibility); return s})
    if(this.sites.length){
      this.currentSite = this.sites[0]
    }
  

  }

}
    

