import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})


export class Auth {
  private http = inject(HttpClient);

  // private loginUrl = `${environment.apiUrl}/admin/login`;
  private loginUrl = `${environment.apiUrl}/admin/login`;

  constructor() {}

  login(credentials: any){

    return this.http.post(this.loginUrl, credentials);
  }
}
