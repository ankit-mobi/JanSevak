import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Auth } from '../../core/auth/auth';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {


  loginData = {
    email: '',
    password: ''
  };
 
  showPassword = false;

  private authService = inject(Auth);
  private router = inject(Router);


  togglePassword(){
    this.showPassword = !this.showPassword;
  }


  onLogin(form: NgForm) {

    if(form.invalid){
      form.control.markAllAsTouched();
      return;
    }

    this.authService.login(this.loginData).subscribe({
      next: (response: any) => {
        
        localStorage.setItem('authToken', response.accessToken);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Login Failed', err);
        alert('Login failed! Please check email/password.');
      }
    });

  }

}
