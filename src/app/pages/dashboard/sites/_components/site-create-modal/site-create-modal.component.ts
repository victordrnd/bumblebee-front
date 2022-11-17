import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-site-create-modal',
  templateUrl: './site-create-modal.component.html',
  styleUrls: ['./site-create-modal.component.scss']
})
export class SiteCreateModalComponent implements OnInit {

  site: any = {
    name: null,
    url: null,
    method: "GET",
    interval: 30,
    protocol : "http://"
  }

  constructor() { }

  ngOnInit(): void {
  }

}
