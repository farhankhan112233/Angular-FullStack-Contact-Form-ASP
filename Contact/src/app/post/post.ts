import { Component, signal } from '@angular/core';
import {
  ReactiveFormsModule,
  FormControl,
  FormsModule,
  FormGroup,
  Validators,
} from '@angular/forms';
import { HttpService } from '../http.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-post',
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './post.html',
  styleUrl: './post.css',
})
export class Post {
  person: any = signal(null);
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
    // if (this.form.invalid) {
    //   throw new Error('Invalid Form Inputs');
    // }

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
      next: (response) => {
        const Id = response.id;
        alert(`Data posted successfully with ID: ${Id}`);
        console.log('Response:', response);
        this.form.reset();
      },
      error(err) {
        if (err.status === 400) {
          alert('Bad Request: Duplicate or Emptly Form');
        }
      },
    });
  }
  getPersonById(value: number) {
    this.HttpService.httpGet(value).subscribe({
      next: (response) => {
        try {
          this.person.set(response);
          console.log('Asssigned to person now its value is :', this.person);
        } catch (error: any) {
          console.log(error.message);
        }
        console.log('Person Details:', response);
      },
      error(err) {
        if (err.status === 404) {
          alert('Person not found');
          console.error('Error:', err);
        }
      },
    });
  }
  editPersonById(value: number) {
    this.HttpService.httpPut(value).subscribe({
      next: (response) => {
        if (response.status === 204) {
          alert('Data has been Updated Successfully');
        }
        console.log('Put Response:', response);
      },
      error(err) {
        if (err.status === 400) {
          alert('Bad Request: Invalid Data');
        } else if (err.status === 404) {
          alert('Person not found');
        }
        console.error('Error:', err);
      },
    });
  }
  deletePersonById(id: number) {
    this.HttpService.httpDelete(id).subscribe({
      next: (res) => {
        if (res.status === 204) {
          alert('Your record has been Deleted');
          console.log('Deleted response', res);
        }
      },
      error: (err) => {
        alert('something went wrong');
        console.log('error from delete', err.message);
      },
    });
  }
}
