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
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './post.html',
  styleUrls: ['./post.css'],
})
export class Post {
  person = signal<any>(null);
  id = signal<number | null>(null);
  display = true;
  form: any;
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
    if (this.form.invalid) {
      alert('Please fill out all required fields.');
      return;
    }

    const dto = this.extractDtoFromForm();

    this.HttpService.httpPost(dto).subscribe({
      next: (response) => {
        const Id = response.id;
        this.id.set(Id);
        alert(`Registered Successfully! Your Id is: ${Id}`);
        console.log('Response:', response);
      },
      error(err) {
        if (err.status === 400) {
          alert('Data Already Exists');
        }
      },
    });
  }

  getPersonById(value: number) {
    this.HttpService.httpGet(value).subscribe({
      next: (response) => {
        this.person.set(response);
        this.display = true;
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

  deletePersonById(id: number) {
    this.HttpService.httpDelete(id).subscribe({
      next: (res) => {
        if (res.status === 204) {
          alert('Your record has been deleted');
          this.person.set(null);
          this.display = false;
          this.id.set(null);
          console.log('Deleted response', res);
        }
      },
      error: (err) => {
        alert('Id not found or already deleted.');
        console.log('Error from delete:', err.message);
      },
    });
  }

  editPersonById() {
    const personId = this.id();
    if (!personId) {
      alert('No ID found. Please register first.');
      return;
    }

    const dto = this.extractDtoFromForm();

    this.HttpService.httpPut(personId, dto).subscribe({
      next: (response) => {
        alert('Record updated successfully.');
        this.getPersonById(personId);
        console.log('Updated response:', response);
      },
      error: (err) => {
        console.error('Error updating:', err.message, err.status);
        alert('Update failed.');
      },
    });
  }

  checkInputValue(input: any) {
    const regex = /^[0-9]+$/;
    if (!regex.test(input)) {
      alert('Please enter a valid ID');
      return;
    }
    this.getPersonById(+input);
  }

  clearForm() {
    this.form.reset();
  }

  private extractDtoFromForm() {
    return {
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
  }
}
