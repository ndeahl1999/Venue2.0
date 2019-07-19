import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UsersService } from '../users.service';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.less']
})
export class SignupComponent implements OnInit {

  angForm: FormGroup
  constructor(private fb: FormBuilder, private us: UsersService) {
      this.createForm();
  }

  createForm(){
    this.angForm = this.fb.group({
     firstName: ['', Validators.required ],
     lastName: ['', Validators.required ],
     email: ['', Validators.required ],
     password: ['', Validators.required ],

   });
  }


  addUser(firstName, lastName, email, password){
    console.log("adding");
    this.us.addUser(firstName, lastName, email, password);
  }
  ngOnInit() {
  }

}
