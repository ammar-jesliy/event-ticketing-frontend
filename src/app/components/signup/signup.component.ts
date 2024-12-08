/**
 * SignupComponent is responsible for handling the user registration process.
 * It provides a form for users to sign up as either a Customer or a Vendor.
 * The component includes form validation, email availability checks, and
 * submission handling for user registration.
 *
 */

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  ValidationErrors,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { forkJoin, map, Observable } from 'rxjs';
import { CustomerService } from '../../services/customer.service';
import { VendorService } from '../../services/vendor.service';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from '../../util/user';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    InputTextModule,
    FloatLabelModule,
    PasswordModule,
    ButtonModule,
    RouterModule,
    DropdownModule,
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;
  roles: Array<string> = ['Customer', 'Vendor'];

  username: string = '';
  email: string = '';
  password: string = '';
  role: string = '';

  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private vendorService: VendorService,
    private router: Router
  ) {}

  /**
   * Initializes the signup form with validation rules.
   * This method is called once the component is initialized.
   *
   * The form contains the following fields:
   * - `username`: A required field.
   * - `email`: A required field with email format validation and a custom email validator.
   * - `password`: A required field with a minimum length of 6 characters.
   * - `role`: A required field.
   */
  ngOnInit(): void {
    this.signupForm = this.fb.group({
      username: ['', Validators.required],
      email: [
        '',
        [Validators.required, Validators.email],
        [this.emailValidator.bind(this)],
      ],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', Validators.required],
    });
  }

  /**
   * Validates the email input to ensure it is not already taken by an admin, customer, or vendor.
   *
   * This validator performs the following checks:
   * 1. Denies registration if the email is the admin email (`admin@admin.com`).
   * 2. Checks if the email is already taken by a customer or vendor by calling respective services.
   *
   * @param control - The form control containing the email value to validate.
   * @returns An observable that emits a validation error object if the email is taken, or null if the email is available.
   */
  emailValidator(control: FormControl): Observable<ValidationErrors | null> {
    // Deny the user to register using the admin email
    const adminEmail = 'admin@admin.com';
    if (control.value === adminEmail) {
      return new Observable((observer) => {
        observer.next({ emailTaken: true });
        observer.complete();
      });
    }

    // Check if the email is already taken by a customer or vendor
    const customerCheck$ = this.customerService.checkEmailAvailability(
      control.value
    );
    const vendorCheck$ = this.vendorService.checkEmailAvailability(
      control.value
    );

    return forkJoin([customerCheck$, vendorCheck$]).pipe(
      map(([isCustomerAvailable, isVendorAvailable]) =>
        isCustomerAvailable && isVendorAvailable ? null : { emailTaken: true }
      )
    );
  }

  /**
   * Handles the form submission for the signup process.
   *
   * This method checks if the signup form is valid. If valid, it sets the loading state to true
   * and extracts the form values. It then creates a user object and determines the role of the user.
   * Depending on the role, it calls the appropriate service to register the user (Customer or Vendor).
   *
   * On successful registration, it resets the form, navigates to the login page, and displays a success message.
   * On failure, it logs the error message, displays an error alert, and resets the loading state.
   *
   * If the form is invalid, it marks all form controls as touched to display validation errors.
   *
   * @returns {void}
   */
  onSubmit() {
    if (this.signupForm.valid) {
      this.loading = true;
      const { username, email, password, role } = this.signupForm.value;

      const user: User = {
        name: username,
        email: email,
        password: password,
        dateCreated: new Date().toISOString(),
      };

      if (role === 'Customer') {
        this.customerService.registerCustomer(user).subscribe({
          next: (response) => {
            this.loading = false;
            alert('Customer Registration Successful');
            this.signupForm.reset();
            this.router.navigate(['/login']);
          },
          error: (error: HttpErrorResponse) => {
            this.loading = false;
            console.log(error.message);
            alert('Failed to register customer');
          },
        });
      } else if (role === 'Vendor') {
        this.vendorService.registerVendor(user).subscribe({
          next: (response) => {
            this.loading = false;
            alert('Vendor Registration Successful');
            this.signupForm.reset();
            this.router.navigate(['/login']);
          },
          error: (error: HttpErrorResponse) => {
            this.loading = false;
            console.log(error.message);
            alert('Failed to register vendor');
          },
        });
      } else {
        this.loading = false;
        alert('Unknown Error, Try Again');
        this.signupForm.reset();
      }
    } else {
      this.signupForm.markAllAsTouched();
    }
  }
}
