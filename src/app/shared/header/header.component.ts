import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UsersService } from 'src/app/core/services/users.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private userService : UsersService) { }
  _isConnected = new BehaviorSubject<boolean>(true);
  
  ngOnInit(): void {
    this.userService.currentUser.subscribe(value => {
      this._isConnected.next(value != null)
    })
  }


  get isConnected(){
    return this._isConnected.value;
  }

}
