import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.sass']
})
export class RegisterComponent implements OnInit {

  form: any = {};
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
 
  constructor(private authService: AuthService, private router: Router) { }
 
  ngOnInit(): void {
  }
 
  onSubmit(): void {
    if(this.form.password !== this.form.matchingPassword){
      this.errorMessage = "Passwords must match. ";
      this.isSuccessful = false;
      this.isSignUpFailed = true;
    } else {
    this.authService.register(this.form).subscribe(
      data => {
        console.log(data);
        this.isSuccessful = true;
        this.isSignUpFailed = false;
        this.router.navigate(['/login']);
      },
      err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    );}
  }
}
