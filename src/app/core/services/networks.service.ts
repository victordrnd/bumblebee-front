import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EndpointsService } from './endpoints.service';

@Injectable({
  providedIn: 'root'
})
export class NetworksService {

  constructor(private http : HttpClient,
    private endpointService: EndpointsService) { }


  list() : Observable<any>{
    const endpoint = this.endpointService.currentEnvValue
    return this.http.get(environment.apiUrl+`/networks/${endpoint.id}`);
  }


  getIp() : any{
    const endpoint = this.endpointService.currentEnvValue
    return this.http.get(environment.apiUrl+`/networks/${endpoint.id}/ip`)
  }

  checkDNS(domain : string){
    return this.http.get(environment.apiUrl+`/networks/dns?domain=${domain}`)
  }


  delete(ids : Array<string>) {
    const endpoint = this.endpointService.currentEnvValue
    return ids.map(id => this.http.delete(environment.apiUrl+`/networks/${endpoint.id}/${id}`));
  }

}
