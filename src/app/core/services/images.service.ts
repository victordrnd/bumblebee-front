import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
}
