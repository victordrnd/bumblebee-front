import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from 'aws-amplify';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { UsersService } from 'src/app/core/services/users.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  needToChangePassword = false
  credentials = {
    username: null,
    password: null,
    new_password: null,
    new_password_repeat: null
  }
  user: any;
  constructor(private userService: UsersService,
    private router: Router,
    private notification : NzNotificationService) { 

    }

  async ngOnInit() {
    const user=  await this.userService.getUser();
    if(user){
      this.router.navigate(['dashboard']);
    }

   
  }


  async signin() {
    let res;
    try{
      res = await this.userService.signIn(this.credentials);
    }catch(e : any){
      this.notification.error('Error', e.message);
      return;
    }
    this.user = res;
    if (res.challengeName == "NEW_PASSWORD_REQUIRED") {
      this.needToChangePassword = true;
    } else {
      this.router.navigate(['/dashboard'])
    }
  }


  forgotPassword(username : string){
    Auth.forgotPassword("victordrnd")
    .then(data => console.log(data))
    .catch(err => console.log(err));
  }


  async changePassword() {
    if (this.credentials.new_password == this.credentials.new_password_repeat) {
      try {
        const res = await this.userService.changePassword(this.user, this.credentials.new_password!);
        this.router.navigate(['/dashboard'])
      } catch (e: any) {
        this.notification.error('Error', "An error has occurend");
      }
    }
  }
}
