import { Injectable } from '@angular/core';
import { Auth, Amplify } from 'aws-amplify';
import { BehaviorSubject, firstValueFrom, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { HttpCacheManager, withCache } from '@ngneat/cashew';
@Injectable({
  providedIn: 'root'
})
export class UsersService {

  currentUser : Subject<any> = new BehaviorSubject<any>(null);
  constructor(private http : HttpClient,
    private cacheManager : HttpCacheManager) { 
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

  
  // ADMIN

  getAllUsers(){
    return this.http.get(environment.apiUrl+"/users",{context: withCache({key:'users_admin'})})
  }

  createUser(user : any){
    this.cacheManager.delete('users_admin');
    return this.http.post(environment.apiUrl+"/users", user);
  }

  enable(username : string){
    this.cacheManager.delete('users_admin');
    return this.http.put(environment.apiUrl+`/users/enable/${username}`, {})
  }

  disable(username : string){
    this.cacheManager.delete('users_admin');
    return this.http.put(environment.apiUrl+`/users/disable/${username}`, {})
  }

  delete(username : string){
    this.cacheManager.delete('users_admin');
    return this.http.delete(environment.apiUrl+`/users/${username}`)
  }
}
