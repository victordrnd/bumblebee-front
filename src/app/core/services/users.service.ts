import { Injectable } from '@angular/core';
import Amplify, { Auth } from 'aws-amplify';
import { BehaviorSubject, firstValueFrom, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CognitoIdentityServiceProvider } from 'aws-sdk'
@Injectable({
  providedIn: 'root'
})
export class UsersService {

  currentUser : Subject<any> = new BehaviorSubject<any>(null);
  private identityServiceProvider : CognitoIdentityServiceProvider | null = null;
  constructor() { 
    Amplify.configure({
      Auth: environment.cognito,
    });
    
  }

  public getUser(): Promise<any> {
    return Auth.currentAuthenticatedUser();
  }


  public signIn(user:any): Promise<any> {
    return Auth.signIn(user.username, user.password)
    .then(async (res) => {
      delete user.password;
      
      this.currentUser.next(user);
      return res;
    });
  }


  public signOut(): Promise<any> {
    return Auth.signOut()
    .then(() => {
      this.identityServiceProvider = null;
      this.currentUser.next(null);
    });
  }

  changePassword(user : any, new_password : string){
    return Auth.completeNewPassword(user,new_password)
  }


  forgotPasswordSubmit(username : string, verification_code : string, new_password : string){
    return Auth.forgotPasswordSubmit(username, verification_code, new_password);
  }

  get currentUserValue(){
    return (this.currentUser as BehaviorSubject<any>).value;
  }



  private async getIdentityServiceProvider(){
    const credentials =  await Auth.currentUserCredentials();
    console.log(credentials);
    if(!this.identityServiceProvider){
      this.identityServiceProvider = new CognitoIdentityServiceProvider({
        credentials
      });
    }
    console.log(this.identityServiceProvider)
    return this.identityServiceProvider;
  }
  
  // ADMIN

  async getAllUsers(){
    const serviceProvider = await this.getIdentityServiceProvider();
    console.log(serviceProvider)
    // return serviceProvider?.listUsers(environment.cognito as any, (err,data) => {
    //   console.log(data);
    // });
  }




}
