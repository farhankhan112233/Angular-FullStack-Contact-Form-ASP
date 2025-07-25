import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Post } from './post/post';
import { HttpService } from './http.service';
@Component({
  selector: 'app-root',
  imports: [Post],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  httpService = inject(HttpService);
  protected readonly title = signal('Contact');
  Get() {
    this.httpService.httpGet().subscribe({
      next: (response) => {
        console.log('Response from server:', response);
      },
      error: (error) => {
        console.error('Error occurred:', error);
      },
    });
  }
}
