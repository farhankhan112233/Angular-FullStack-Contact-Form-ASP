import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class HttpService {
  httpClient = inject(HttpClient);

  httpPost(data: any): Observable<any> {
    const url = 'https://localhost:7072/api/Persons';
    return this.httpClient.post(url, data, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  httpGet(id: number): Observable<any> {
    const Url = `https://localhost:7072/api/Persons/${id}`;
    return this.httpClient.get(Url, { responseType: 'json' });
  }
  // httpGetPersonById(): Observable<any>{
  //   this.httpGet
  // }
  httpPut(id: number, data: any): Observable<any> {
    const url = `https://localhost:7072/api/Persons/${id}`;
    return this.httpClient.put(url, data, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  httpDelete(id: number): Observable<any> {
    const url = `https://localhost:7072/api/Persons/${id}`;
    return this.httpClient.delete(url, {
      responseType: 'text',
      observe: 'response',
    });
  }
}
