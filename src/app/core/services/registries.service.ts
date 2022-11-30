import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RegistriesService {

  constructor(private http : HttpClient) { }

  getAll(){
    return this.http.get(environment.apiUrl+"/registries")
  }

  create(registry : any){
    return this.http.post(environment.apiUrl+ "/registries", registry);
  }


  delete(id : number){
    return this.http.delete(environment.apiUrl+`/registries/${id}`);
  }
}
