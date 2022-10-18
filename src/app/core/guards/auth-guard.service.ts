import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import Amplify from 'aws-amplify';
import { environment } from 'src/environments/environment';
import { UsersService } from '../services/users.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(private router: Router,
    private userService : UsersService
  ) { }

  async canActivate() {
    try {
      const session = await this.userService.getUser(); 
      if (session.username) {
        return true;
      }
      this.router.navigate(['login']);
      return false;
    } catch (error) {
      this.router.navigate(['login']);
      return false
    }
  }
}
