import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {

  @Input() site? : any = {};
  @Input() currentSite? : any;
  checks: any;
  @ViewChild(BaseChartDirective) chart?:  BaseChartDirective;
  constructor() { }

  ngOnInit(): void {
  }

  public lineChartOptions: ChartConfiguration['options'] = {
    elements: {
      line: {
        tension: 0.5
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
}
