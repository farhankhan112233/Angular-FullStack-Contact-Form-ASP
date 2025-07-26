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
  display: boolean = true;
  id = signal(null);

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
        this.id.set(Id);

        alert(
          `Registered Successfully! Your Id is :  ${Id}. If You want to see your details, please enter your Id in the input field and click on "Click to See Info" button.`
        );
        console.log('Response:', response);
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
          alert('Your record has been Deleted');
          this.display = false;
          this.person.set(null);
          this.id.set(null);
          console.log('Deleted response', res);
        }
      },
      error: (err) => {
        alert('Id not found or already deleted. Enter a valid Id');
        console.log('error from delete', err.message);
      },
    });
  }
  editPersonById() {
    const id = this.id();
    if (!id) {
      alert('No id found. Please register first.');
      return;
    }

    const editedDto = {
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
    this.HttpService.httpPut(id, editedDto).subscribe({
      next: (response) => {
        alert('Your record has been updated successfully');
        this.getPersonById(id);
        console.log('Updated response:', response);
      },
      error: (err) => {
        if (err.status === 404) {
          alert('Person not found');
          console.error('Error:', err);
        } else {
          alert('Failed to update the record');
          console.error('Error:', err);
        }
      },
    });
  }
  checkInputValue(para: any) {
    const regex = /^[0-9]+$/;
    if (!regex.test(para)) {
      alert('Please enter a valid ID');
      throw new Error('Input is Not number');
    } else {
      this.getPersonById(para);
    }
  }
  clearForm() {
    this.form.reset();
    this.id.set(null);
  }
}
