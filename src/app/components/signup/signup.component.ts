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

    // return this.customerService
    //   .checkEmailAvailability(control.value)
    //   .pipe(
    //     map((isAvailable: boolean) =>
    //       isAvailable ? null : { emailTaken: true }
    //     )
    //   );
  }

  onSubmit() {
    if (this.signupForm.valid) {
      this.loading = true;
      const { username, email, password, role } = this.signupForm.value;

      const user: User = {
        name: username,
        email: email,
        password: password,
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

      // console.log('Role = ' + role);
      // console.log('Username = ' + username);
      // console.log('Email = ' + email);
      // console.log('Password = ' + password);

      // setTimeout(() => {
      //   this.loading = false;
      //   alert('Sign-up Successful');
      //   this.signupForm.reset();
      // });
    } else {
      this.signupForm.markAllAsTouched();
    }
  }
}
