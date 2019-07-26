import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.less']
})
export class SignupComponent implements OnInit {

  constructor(
      private formBuilder: FormBuilder,
      private router: Router,
      private toastr: ToastrService,
      private userService: UserService
    ) { }
    registerForm: FormGroup;
    loading = false;
    submitted = false;

    ngOnInit() {
      this.registerForm = this.formBuilder.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required,Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]]
    });
    }

    get fval() { return this.registerForm.controls; }

    onFormSubmit(){
      this.submitted = true;
      // return for here if form is invalid
      if (this.registerForm.invalid) {
        console.log("invalid form");
        return;
      }
      console.log("submitting form");
      this.loading = true;
      this.userService.register(this.registerForm.value).subscribe(
        (data) => {
          alert('Account has been created!');
          this.router.navigate(['/login']);
        },
        (error) => {
          this.toastr.error(error.error.message, 'Error');
          this.loading = false;
        }
      )
    }
}
