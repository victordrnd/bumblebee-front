import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EndpointsService } from './endpoints.service';

@Injectable({
  providedIn: 'root'
})
export class ContainersService {

  constructor(private endpointService: EndpointsService,
    private http: HttpClient) { }

  list() : Observable<any>{
    const endpoint = this.endpointService.currentEnvValue
    return this.http.get(environment.apiUrl+`/containers/${endpoint.id}`);
  }

  find(id : string){
    const endpoint = this.endpointService.currentEnvValue
    return this.http.get(environment.apiUrl+`/containers/${endpoint.id}/${id}`);
  }
  
  start(ids : string[]) : Array<Observable<any>>{
    const endpoint = this.endpointService.currentEnvValue
    return ids.map(id => this.http.post(environment.apiUrl+`/containers/${endpoint.id}/${id}/start`, {}))
  }

  stop(ids : string[]) : Array<Observable<any>>{
    const endpoint = this.endpointService.currentEnvValue
    return ids.map(id => this.http.post(environment.apiUrl+`/containers/${endpoint.id}/${id}/stop`, {}))
  }

  restart(ids : string[]) : Array<Observable<any>>{
    const endpoint = this.endpointService.currentEnvValue
    return ids.map(id => this.http.post(environment.apiUrl+`/containers/${endpoint.id}/${id}/restart`, {}))
  }

  rename(id : string, name : string){
    const endpoint = this.endpointService.currentEnvValue
    return this.http.put(environment.apiUrl+`/containers/${endpoint.id}/${id}/rename`,{name});
  }

  delete(ids : string[]) :  Array<Observable<any>>{
    const endpoint = this.endpointService.currentEnvValue
    return ids.map(id => this.http.delete(environment.apiUrl+`/containers/${endpoint.id}/${id}`))
  }

  logs(id : string){
    const endpoint = this.endpointService.currentEnvValue
    return this.http.get(environment.apiUrl+`/containers/${endpoint.id}/${id}/logs`)
  }


  logs_sse(id : string) : Observable<String>{
    const endpoint = this.endpointService.currentEnvValue
    // const evs= new EventSource(`${environment.apiUrl}/sse/containers/${endpoint.id}/${id}/logs`);
    return new Observable(observer => {
      const eventSource = new EventSource(`${environment.apiUrl}/containers/sse/${endpoint.id}/${id}/logs`);
      eventSource.onmessage = x => observer.next(x.data);
      eventSource.onerror = x => observer.error(x);

      return () => {
        eventSource.close();
      };
    });
  }
}
