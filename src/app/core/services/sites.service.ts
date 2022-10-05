import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SitesService {

  constructor(private http : HttpClient) { }


  findAll(){
    return this.http.get(environment.apiUrl+'/sites');
  }

  find(id :number){
    return this.http.get(environment.apiUrl+`/sites/${id}`);
  }


}
