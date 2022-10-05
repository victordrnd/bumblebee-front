import { Component, OnInit } from '@angular/core';
import { SitesService } from 'src/app/core/services/sites.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  sites : any= [];
  constructor(private siteService : SitesService) { }

  async ngOnInit() {
    this.sites = await this.siteService.findAll().toPromise();
    console.log(this.sites)
  }

}

