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

  pull(image_name : string){
    const endpoint = this.endpointService.currentEnvValue
    const eventSource = new EventSource(`${environment.apiUrl}/networks/sse/${endpoint.id}/pull?image=${encodeURI(image_name)}`);
    return this.generateObservableFromEventSource(eventSource)
  }


  download(image_id:number){
    const endpoint = this.endpointService.currentEnvValue
    return environment.apiUrl+`/networks/${endpoint.id}/${image_id}/download`;

  }



  delete(ids : Array<string>) {
    const endpoint = this.endpointService.currentEnvValue
    return ids.map(id => this.http.delete(environment.apiUrl+`/networks/${endpoint.id}/${id}`));
  }

  private generateObservableFromEventSource(eventSource : EventSource) : Observable<any>{
    return new Observable(observer => {
      eventSource.onmessage = x => observer.next(x.data);
      eventSource.onerror = x => observer.error(x);
      return () => {
        eventSource.close();
      };
    });
  }

}
