import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DnsService {

  constructor(private http : HttpClient) { }


  list(){
    return this.http.get(environment.apiUrl+'/dns');
  }


  save(dns : any[]){
    return this.http.post(environment.apiUrl+'/dns', {dns});
  }
}
