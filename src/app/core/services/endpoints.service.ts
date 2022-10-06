import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { withCache } from '@ngneat/cashew';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EndpointsService {

  private currentEnvironment = new BehaviorSubject<any>(null);
  
  constructor(private http : HttpClient) {
   
   }


  list() : Observable<any[]>{
    return this.http.get(environment.apiUrl+"/endpoints") as Observable<any[]>
  }


  setCurrentEnv(endpoint:any){
    localStorage.setItem('currentEnv', JSON.stringify(endpoint));
    this.currentEnvironment.next(endpoint);
  }

  get currentEnv(){
    if(!this.currentEnvironment.value){
      const storedEnv = JSON.parse(localStorage.getItem('currentEnv') || "");
      console.log(storedEnv)
      if(storedEnv){
        this.setCurrentEnv(storedEnv);
      }
    }
    return this.currentEnvironment.asObservable()
  }

  get currentEnvValue(){
    return this.currentEnvironment.value
  }
}
