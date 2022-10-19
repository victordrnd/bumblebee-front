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
  action: string | null = null;
  credentials = {
    username: null,
    password: null,
    new_password: null,
    new_password_repeat: null,
    verification_code: null
  }
  loading = false;
  user: any;
  constructor(private userService: UsersService,
    private router: Router,
    private notification: NzNotificationService) {

  }

  async ngOnInit() {
    const user = await this.userService.getUser();
    if (user) {
      this.router.navigate(['dashboard']);
    }


  }


  async signin() {
    let res;
    this.loading = true;
    try {
      res = await this.userService.signIn(this.credentials);
    } catch (e: any) {
      this.notification.error('Error', e.message);
      return;
    }
    this.loading = false;
    this.user = res;
    if (res.challengeName) {
      this.action = res.challengeName;
      this.action = "NEW_PASSWORD_REQUIRED";
    } else {
      this.router.navigate(['/dashboard'])
    }
  }


  async forgotPassword() {
    try {
      const res = await Auth.forgotPassword(this.credentials.username!)
      this.notification.success('Success', `An email has been sent to ${res.CodeDeliveryDetails.Destination}`)
      this.action = "PASSWORD_FORGOT_CODE"
    } catch (e: any) {
      this.notification.error('Error', e.message)
    }
  }


  async changePassword() {
    if (this.credentials.new_password == this.credentials.new_password_repeat) {
      this.loading = true;
      if (!this.credentials.verification_code) {
        try {
          const res = await this.userService.changePassword(this.user, this.credentials.new_password!);
          this.router.navigate(['/dashboard'])
        } catch (e: any) {
          this.notification.error('Error', "An error has occurend");
        }
      } else {
        this.userService.forgotPasswordSubmit(this.credentials.username!, this.credentials.verification_code, this.credentials.new_password!).then((res:any) => {
          this.notification.success("Success", "Password has been saved");
          this.credentials.password = this.credentials.new_password;
          this.signin();
        }).catch((e:any) => {
          this.notification.error('Error', e.message);
        })
      }
      this.loading = false;
    } else {
      this.notification.error('Error', "Password does not match")
    }
  }
}
