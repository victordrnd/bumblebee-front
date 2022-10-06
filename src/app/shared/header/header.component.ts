import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor() { }
  _isConnected = new BehaviorSubject<boolean>(true);
  ngOnInit(): void {
    this._isConnected.next(true);
  }


  get isConnected(){
    return this._isConnected.value;
  }

}
