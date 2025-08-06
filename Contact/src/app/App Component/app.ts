import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Post } from '../contact form/post';
import { HttpService } from '../Services/http.service';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
