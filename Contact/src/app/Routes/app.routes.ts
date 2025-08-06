import { Routes } from '@angular/router';
import { Login } from '../login/login';
import { Post } from '../contact form/post';

export const routes: Routes = [
  { path: '', component: Login },
  { path: 'form', component: Post },
];
