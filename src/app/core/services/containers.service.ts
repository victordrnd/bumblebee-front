import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EndpointsService } from './endpoints.service';
import { NativeEventSource, EventSourcePolyfill } from 'event-source-polyfill';

@Injectable({
  providedIn: 'root'
})
export class ContainersService {

  constructor(private endpointService: EndpointsService,
    private socket : Socket,
    private http: HttpClient) {

     }

  list() : Observable<any>{
    const endpoint = this.endpointService.currentEnvValue
    return this.http.get(environment.apiUrl+`/containers/${endpoint.id}`);
  }

  find(id : string){
    const endpoint = this.endpointService.currentEnvValue
    return this.http.get(environment.apiUrl+`/containers/${endpoint.id}/${id}`);
  }
  
  create(body : any){
    const endpoint = this.endpointService.currentEnvValue
    return this.http.post(environment.apiUrl+`/containers/${endpoint.id}`, body);
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

  export(ids : string[]){
    const endpoint = this.endpointService.currentEnvValue
    return this.http.post(environment.apiUrl+`/containers/${endpoint.id}/export`,{containers_ids : ids});
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

  filesystem(id: string, path : string = ""){
    const endpoint = this.endpointService.currentEnvValue
    return this.http.get(environment.apiUrl+`/containers/${endpoint.id}/${id}/fs/${path}`, {responseType : "arraybuffer"})
  }

  logs_sse(id : string) : Observable<String>{
    const endpoint = this.endpointService.currentEnvValue
    const eventSource = new EventSourcePolyfill(`${environment.apiUrl}/containers/sse/${endpoint.id}/${id}/logs`,{headers :{ authorization :"Bearer " + localStorage.getItem('jwt_token')}});
    return this.generateObservableFromEventSource(eventSource)
   
  }

  stats(id : string) : Observable<String>{
    const endpoint = this.endpointService.currentEnvValue
    const eventSource = new EventSourcePolyfill(`${environment.apiUrl}/containers/sse/${endpoint.id}/${id}/stats`, {headers :{ authorization :"Bearer " + localStorage.getItem('jwt_token')}});
    return this.generateObservableFromEventSource(eventSource)
  }


  attach(container_id : string){
    const endpoint = this.endpointService.currentEnvValue
    this.socket.connect();
    const sock = this.socket;
    this.socket.on('connect', function(){
      sock.emit('docker.terminal', {endpoint_id : endpoint.id, container_id : container_id})
    })
    return sock.fromEvent('docker.terminal')
  }

  detach(){
    this.socket.removeAllListeners("docker.terminal");
    this.socket.ioSocket._callbacks = {}
    this.socket.disconnect();
  }

  exec(container_id : string, command : string){
    const endpoint = this.endpointService.currentEnvValue
    this.socket.emit('docker.terminal.command', {endpoint_id : endpoint.id, container_id : container_id, command})
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
