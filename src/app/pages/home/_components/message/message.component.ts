import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {
  @Input() site? : any = {};
  checks : any[] = [];

  constructor() { }

  ngOnInit(): void {
    const midnight = new Date();
    midnight.setHours(0);
    midnight.setMinutes(0);
    console.log(midnight);

    //Compare n-1 and n+1 checksresponseTime
    this.checks = this.site.checks.filter((c:any) => !c.up);
    this.checks.forEach(element => console.log(element));
  }

}
