import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpService } from '../Services/http.service';
import CryptoJS from 'crypto-js';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  httpService = inject(HttpService);
  loginForm!: FormGroup;
  route = inject(Router);
  ngOnInit() {
    this.loginForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
  }
  onSubmit() {
    if (!this.loginForm.valid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    const rawPass = this.loginForm.get('password')?.value;
    const hashed = CryptoJS.SHA256(rawPass).toString();
    const dto = {
      username: this.loginForm.get('username')?.value,
      password: hashed,
    };
    this.httpService.loginPost(dto).subscribe({
      next: (res) => {
        this.route.navigate(['form']);
        if (res === null) {
          return;
        }
        sessionStorage.setItem('Token', res.token);
      },
      error: (err) => {
        if (err.status == 400) {
          alert('Username or Password not Found');
        }
        console.log('Errror', err.message);
      },
    });
  }
}
