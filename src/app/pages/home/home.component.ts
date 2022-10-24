import { Component, OnInit } from '@angular/core';
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
    this.sites = await this.siteService.findAll().toPromise();
    this.sites = this.sites.map((s:any) => {s.disponibility = Math.round(s.disponibility); return s})
    console.log(this.sites);
   
  

  }

}
    

