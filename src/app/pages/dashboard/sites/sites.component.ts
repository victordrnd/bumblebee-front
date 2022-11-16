import { Component, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { SitesService } from 'src/app/core/services/sites.service';

@Component({
  selector: 'app-sites',
  templateUrl: './sites.component.html',
  styleUrls: ['./sites.component.scss']
})
export class SitesComponent implements OnInit {
  sites :any[] = [];
  constructor(private siteService : SitesService) { }

  async ngOnInit() {
    this.sites = await firstValueFrom(this.siteService.findAll()) as any[];
    this.sites = this.sites.map(s => {s.checks = s.checks.slice(-35);return s})
  }

}
