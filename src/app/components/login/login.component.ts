import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
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

  private adminCredentials = {
    email: 'admin@admin.com',
    password: 'admin123',
  };

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private vendorService: VendorService,
    private router: Router
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

      // Check if the user is an admin
      if (email === this.adminCredentials.email) {
        if (password !== this.adminCredentials.password) {
          this.loading = false;
          alert('Invalid Credentials');
          return;
        }
        this.loading = false;

        // Store user authentication status
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userRole', 'admin');
        localStorage.setItem(
          'user',
          JSON.stringify({ email: email, name: 'Admin' })
        );

        alert('Successfully logged in as admin');
        this.loginForm.reset();

        this.router.navigate(['/admin-dashboard']);
        return;
      }

      // Non-admin logic: Check email in both customer and vendor services
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
                // Store user authentication status
                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('userRole', 'customer');
                localStorage.setItem('user', JSON.stringify(response));

                alert('Successfully logged in customer');
                this.loginForm.reset();

                this.router.navigate(['/buy-tickets']);
              },
              error: (error: HttpErrorResponse) => {
                console.log(error.message);
                alert('Invalid Credentials');
              },
            });
          } else if (!isVendor) {
            this.vendorService.loginVendor(email, password).subscribe({
              next: (response) => {
                // Store user authentication status
                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('userRole', 'vendor');
                localStorage.setItem('user', JSON.stringify(response));

                alert('Successfully logged in Vendor');
                this.loginForm.reset();

                this.router.navigate(['/dashboard']);
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
