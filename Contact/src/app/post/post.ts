import { Component } from '@angular/core';
import {
  ReactiveFormsModule,
  FormControl,
  FormsModule,
  FormGroup,
  Validators,
} from '@angular/forms';
import { HttpService } from '../http.service';
@Component({
  selector: 'app-post',
  imports: [ReactiveFormsModule],
  templateUrl: './post.html',
  styleUrl: './post.css',
})
export class Post {
  form?: any;
  constructor(private HttpService: HttpService) {}
  ngOnInit() {
    this.form = new FormGroup({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl(''),
      mail: new FormControl('', Validators.required),
      gender: new FormControl('', Validators.required),
      Address: new FormGroup({
        street: new FormControl('', Validators.required),
        city: new FormControl('', Validators.required),
        country: new FormControl('', Validators.required),
      }),
      phone: new FormControl('', Validators.required),
      description: new FormControl(''),
    });
  }
  onSubmit() {
    if (!this.form.valid) {
      throw new Error('Invalid Form Inputs');
    }

    const dto = {
      firstName: this.form.get('firstName')?.value,
      lastName: this.form.get('lastName')?.value,
      mail: this.form.get('mail')?.value,
      gender: this.form.get('gender')?.value,
      address: {
        street: this.form.get('Address.street')?.value,
        city: this.form.get('Address.city')?.value,
        country: this.form.get('Address.country')?.value,
      },
      phone: this.form.get('phone')?.value,
      description: this.form.get('description')?.value,
    };

    this.HttpService.httpPost(dto).subscribe({
      next: (res) => console.log('Success:', res),
      error: (err) => console.error('Error occurred:', err),
    });
  }
}
