import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class HttpService {
  url = 'https://localhost:7072/api/Persons';
  httpClient = inject(HttpClient);
  httpPost(data: any): Observable<any> {
    return this.httpClient.post(this.url, data, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  httpGet(): Observable<any> {
    const Url = 'https://localhost:7072/api/Persons';
    return this.httpClient.get(Url, { responseType: 'json' });
  }
}
