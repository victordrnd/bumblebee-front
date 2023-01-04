import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-registry-modal',
  templateUrl: './create-registry-modal.component.html',
  styleUrls: ['./create-registry-modal.component.scss']
})
export class CreateRegistryModalComponent implements OnInit {

  registry = {
    name : null,
    url : null,
    username : null,
    password : null
  }

  

  ngOnInit(): void {
  }

}
