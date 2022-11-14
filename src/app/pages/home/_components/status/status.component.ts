import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss']
})
export class StatusComponent implements OnInit {

  @Input() site? : any = {};
  checks : any[] = [];
  @Input() currentSite? : any;
  constructor() { }
  
  ngOnInit(): void {
    this.checks = this.site.checks.slice(-30);
  }

  ngOnChanges(){
    this.ngOnInit();
  }
}
