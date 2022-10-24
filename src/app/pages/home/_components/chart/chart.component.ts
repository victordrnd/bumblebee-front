import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit, AfterViewInit {

  @Input() site? : any = {};
  checks: any;
  @ViewChild(BaseChartDirective) chart?:  BaseChartDirective;
  constructor() { }
  ngAfterViewInit(): void {
    this.site.checks = this.site.checks.splice(-400);
    this.lineChartData.datasets[0].data = this.site.checks.map((check:any) => check.latency);
    this.lineChartData.labels = this.site.checks.map((c:any) => new Date(c.created_at).toLocaleTimeString());
    this.chart?.update();
  }

  ngOnInit(): void {
  }

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
      duration: 1500
    }
  };

  public lineChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [],
        label: 'Latency in ms',
        backgroundColor: '#F8ba1644',
        borderColor: '#F8ba16',
        pointBackgroundColor: 'rgba(148,159,177,0)',
        pointBorderColor: '#ffffffff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(148,159,177,0.8)',
        fill: 'origin',
      }
    ],
    labels: []
  };
}

