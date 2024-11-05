import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { forkJoin } from 'rxjs';
import { CustomerService } from '../../services/customer.service';
import { VendorService } from '../../services/vendor.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    RouterModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private vendorService: VendorService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loading = true;
      const { email, password } = this.loginForm.value;

      // Check email in both customer and vendor services
      forkJoin({
        isCustomer: this.customerService.checkEmailAvailability(email),
        isVendor: this.vendorService.checkEmailAvailability(email),
      }).subscribe({
        next: ({ isCustomer, isVendor }) => {
          this.loading = false;
          console.log(!isCustomer, !isVendor);
          if (!isCustomer) {
            this.customerService.loginCustomer(email, password).subscribe({
              next: (response) => {
                alert(response.message);
                this.loginForm.reset();
              },
              error: (error: HttpErrorResponse) => {
                console.log(error.message);
                alert('Invalid Credentials');
              },
            });
          } else if (!isVendor) {
            this.vendorService.loginVendor(email, password).subscribe({
              next: (response) => {
                alert(response.message);
                this.loginForm.reset();
              },
              error: (error: HttpErrorResponse) => {
                console.log(error.message);
                alert('Invalid Credentials');
              },
            });
          }
        },
        error: (error: HttpErrorResponse) => {
          this.loading = false;
          console.error(error.message);
          alert('An error occurred during login');
        },
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
