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
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { forkJoin, map, Observable } from 'rxjs';
import { CustomerService } from '../../services/customer.service';
import { VendorService } from '../../services/vendor.service';

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
    private vendorService: VendorService
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
      console.log('Role = ' + role);
      console.log('Username = ' + username);
      console.log('Email = ' + email);
      console.log('Password = ' + password);

      setTimeout(() => {
        this.loading = false;
        alert('Sign-up Successful');
        this.signupForm.reset();
      });
    } else {
      this.signupForm.markAllAsTouched();
    }
  }
}
