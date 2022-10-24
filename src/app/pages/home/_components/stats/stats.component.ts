import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { SitesService } from 'src/app/core/services/sites.service';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit {

  @Input() site? : any = {};
  checks : any[] = [];
  dailyUptime : number = 0;
  monthlyUptime : number = 0;
  dailyDisponibility : number = 0;
  responseTime : number = 0;


  constructor(private activatedRoute : ActivatedRoute,
    private siteService : SitesService) { }

  async ngOnInit() {
    const midnight = new Date();
    midnight.setHours(0);
    midnight.setMinutes(0);
    console.log(midnight);
    this.checks = this.site.checks.filter((c:any) => new Date(c.created_at) > midnight);
    this.dailyUptime = (this.checks.filter(c => c.up).length / this.checks.length) * 100
    this.dailyDisponibility = this.checks.map(c =>c.latency).reduce((partialSum, a) => partialSum + a, 0) / this.checks.length;
    
    this.responseTime = this.checks.pop().latency

    midnight.setMonth(midnight.getMonth()-1)
    console.log(this.checks)
    this.checks = this.site.checks.filter((c:any) => new Date(c.created_at) > midnight);
    this.monthlyUptime = (this.checks.filter(c => c.up).length / this.checks.length) * 100
    
    
    

  }


  

}
