import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { UsersService } from '../services/users.service';


@Injectable()
export class HttpTokenInterceptor implements HttpInterceptor {
  constructor(private userService: UsersService) {}

intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let headersConfig  : any = {};
    const token =  this.userService.jwt;
    if (token) {
      headersConfig['Authorization'] = `Bearer ${token}`;
      headersConfig['X-Requested-With'] = `XMLHttpRequest`; 
    }
    const request = req.clone({ setHeaders: headersConfig });
    
    return next.handle(request);
  }
}