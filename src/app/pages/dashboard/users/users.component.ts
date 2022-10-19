import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/core/services/users.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  users : any=[];
  constructor(private usersService : UsersService) { }

  async ngOnInit() {
    this.users = await this.usersService.getAllUsers();
    console.log(this.users);
  } 

}
