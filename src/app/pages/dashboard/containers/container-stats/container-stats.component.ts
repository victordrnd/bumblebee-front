import { Component, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { firstValueFrom, Subscription } from 'rxjs';
import { ContainersService } from 'src/app/core/services/containers.service';

@Component({
  selector: 'app-container-stats',
  templateUrl: './container-stats.component.html',
  styleUrls: ['./container-stats.component.scss']
})
export class ContainerStatsComponent implements OnInit, OnDestroy  {

  id? : string;
  sse_observer? : any;
  stats? : any[];
  container? : any;
  subsciptions :Subscription[] = [];

  public lineChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [],
        label: '% Memory',
        backgroundColor: 'rgba(148,159,177,0.2)',
        borderColor: 'rgba(148,159,177,1)',
        pointBackgroundColor: 'rgba(148,159,177,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(148,159,177,0.8)',
        fill: 'origin',
      }
    ],
    labels: []
  };

  public lineChartData2: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [],
        label: '% CPU',
        backgroundColor: 'rgba(255,0,0,0.3)',
        borderColor: 'red',
        pointBackgroundColor: 'rgba(148,159,177,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(148,159,177,0.8)',
        fill: 'origin',
      },
    ],
    labels: []
  };

  public lineChartData3: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [],
        label: 'Transmitted data (ko)',
        backgroundColor: 'rgba(255,0,0,0.3)',
        borderColor: 'red',
        pointBackgroundColor: 'rgba(148,159,177,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(148,159,177,0.8)',
        fill: 'origin',
      },
      {
        data: [],
        label: 'Received data (ko)',
        borderColor: "#55bae7",
        pointBackgroundColor: "#55bae7",
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#55bae7',
        fill: 'origin',
      },
    ],
    labels: []
  };

  public lineChartOptions: ChartConfiguration['options'] = {
    elements: {
      line: {
        tension: 0.5
      },
      point : {
        radius : 0
      }
    },
    scales: {
      x: {},
      'y-axis-0':
        {
          position: 'left',
          beginAtZero : true,
        },
    },
    plugins: {
      legend: { display: true }
    },
    animation:{
      
      duration: 400
    }
  };


  @ViewChildren(BaseChartDirective) charts?:  QueryList<BaseChartDirective>;
  
  constructor(private route : ActivatedRoute,
    private router: Router,
    private containerService : ContainersService) { }
  
  async ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id')!;
    this.container = await firstValueFrom(this.containerService.find(this.id!));
    this.sse_observer = this.containerService.stats(this.id!)
    const sb = this.sse_observer.subscribe((stat:any) => {
      let stats = JSON.parse(stat);
      const date = new Date().toLocaleTimeString()
      this.lineChartData.datasets[0].data.push(parseFloat(((stats.memory_stats.usage / stats.memory_stats.limit )*100).toFixed(2)))
      let cpu_delta =  stats.cpu_stats.cpu_usage.total_usage - stats.precpu_stats.cpu_usage.total_usage
      const system_cpu = stats.cpu_stats.system_cpu_usage - stats.precpu_stats.system_cpu_usage
      this.lineChartData2.datasets[0].data.push(parseFloat(((cpu_delta / system_cpu) * stats.cpu_stats.online_cpus * 100.0).toFixed(2)))
      this.lineChartData3.datasets[0].data.push(stats.networks.eth0.tx_bytes / 1024);
      this.lineChartData3.datasets[1].data.push(stats.networks.eth0.rx_bytes / 1024);
      this.lineChartData.labels?.push(date)
      this.lineChartData2.labels?.push(date);
      this.lineChartData3.labels?.push(date);
      this.charts!.map(el => el.chart!.update());
    });
    this.subsciptions.push(sb)
  }


  onBack() {
    this.router.navigate(["dashboard/containers"])
  }



  ngOnDestroy(): void {
    this.subsciptions.forEach(s => s.unsubscribe());
  }

}
