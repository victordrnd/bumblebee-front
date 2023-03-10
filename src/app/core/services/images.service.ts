import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EventSourcePolyfill } from 'event-source-polyfill';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EndpointsService } from './endpoints.service';

@Injectable({
  providedIn: 'root'
})
export class ImagesService {

  constructor(private http : HttpClient,
    private endpointService: EndpointsService) { }


  list() : Observable<any>{
    const endpoint = this.endpointService.currentEnvValue
    return this.http.get(environment.apiUrl+`/images/${endpoint.id}`);
  }

  pull(image_name : string, registry_id : number | null){
    const endpoint = this.endpointService.currentEnvValue
    const eventSource = new EventSourcePolyfill(`${environment.apiUrl}/images/sse/${endpoint.id}/pull?image=${encodeURI(image_name)}&registry_id=${registry_id}`,{headers :{ authorization :"Bearer " + localStorage.getItem('jwt_token')}});
    return this.generateObservableFromEventSource(eventSource)
  }


  download(image_id:number){
    const endpoint = this.endpointService.currentEnvValue
    return environment.apiUrl+`/images/${endpoint.id}/${image_id}/download`;

  }



  delete(ids : Array<string>) {
    const endpoint = this.endpointService.currentEnvValue
    return ids.map(id => this.http.delete(environment.apiUrl+`/images/${endpoint.id}/${id}`));
  }


  isUpToDate(image_id : string){
    const endpoint = this.endpointService.currentEnvValue
    return this.http.get(environment.apiUrl+`/images/${endpoint.id}/${image_id}/status`);
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
