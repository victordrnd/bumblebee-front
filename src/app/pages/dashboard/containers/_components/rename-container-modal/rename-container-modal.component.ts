import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-rename-container-modal',
  templateUrl: './rename-container-modal.component.html',
  styleUrls: ['./rename-container-modal.component.scss']
})
export class RenameContainerModalComponent implements OnInit {
  name :string = "";
  image : string = "";
  constructor() { }

  ngOnInit(): void {
  }

}
