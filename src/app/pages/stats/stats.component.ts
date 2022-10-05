import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { SitesService } from 'src/app/core/services/sites.service';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit {

  constructor(private activatedRoute : ActivatedRoute,
    private siteService : SitesService) { }

  site : any;
  async ngOnInit() {
    const id = this.activatedRoute.snapshot.params['id'] || null;
    this.site = await this.siteService.find(id)
  }


  

}
