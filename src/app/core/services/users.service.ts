import { Injectable } from '@angular/core';
import Amplify, { Auth } from 'aws-amplify';
import { BehaviorSubject, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class UsersService {

  currentUser : Subject<any> = new BehaviorSubject<any>(null)
  constructor() { 
    Amplify.configure({
      Auth: environment.cognito,
    });
  }

  public getUser(): Promise<any> {
    return Auth.currentUserInfo();
  }


  public signIn(user:any): Promise<any> {
    return Auth.signIn(user.email, user.password)
    .then(() => {
      delete user.password;
      this.currentUser.next(user);
    });
  }


  public signOut(): Promise<any> {
    return Auth.signOut()
    .then(() => {
      this.currentUser.next(null);
    });
  }


  get currentUserValue(){
    return (this.currentUser as BehaviorSubject<any>).value;
  }






}
