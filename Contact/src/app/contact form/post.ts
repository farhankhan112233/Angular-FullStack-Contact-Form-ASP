import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpService } from '../Services/http.service';

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
  display: boolean = true;
  form!: any;
  isEdit: boolean = true;
  constructor(private HttpService: HttpService) {}

  formValues() {
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
  ngOnInit() {
    this.formValues();
  }

  onSubmit() {
    if (this.form.invalid) {
      alert('Please fill out all required fields.');
      return;
    }
    if (!this.isEdit) {
      const personId = this.id();
      if (!personId) {
        alert('No ID found. Please register first.');
        return;
      }
      const dto = this.extractDtoFromForm();
      this.HttpService.httpPut(personId, dto).subscribe({
        next: (response) => {
          this.id.set(response.id);
          this.form.reset();
          alert('Record updated successfully.');
        },
        error: (err) => {
          alert('Update failed. Please try again.' + err.message);
        },
      });
    } else {
      const dto = this.extractDtoFromForm();
      this.form.reset();
      this.HttpService.httpPost(dto).subscribe({
        next: (response) => {
          this.id.set(response.id);
          this.display = true;
          this.person.set(response);
          alert(`Registered Successfully!`);
          console.log('Response:', response);
        },
        error(err) {
          console.log('error in post', err, err.message);
          if (err.status == 400) {
            alert('Data Already Exists');
          }
        },
      });
    }
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
  editPersonById() {
    const personId = this.id();
    this.isEdit = false;
    this.form.patchValue({
      firstName: this.person().firstName,
      lastName: this.person().lastName,
      mail: this.person().mail,
      gender: this.person().gender,
      Address: {
        street: this.person().address.street,
        city: this.person().address.city,
        country: this.person().address.country,
      },
      phone: this.person().phone,
      description: this.person().description,
    });
  }

  deletePersonById(id: number) {
    if (!id) {
      alert('Enter a Valid Id');
      return;
    }
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
        console.log('Error from delete:', err.message);
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
    this.display = false;
    this.isEdit = true;
    this.person.set(null);
    this.id.set(null);
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
