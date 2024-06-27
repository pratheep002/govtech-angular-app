import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';  
import { AuthService } from '../AuthService';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';
  errorMessage: string | null = null; 

  constructor(public authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    // Example usage
    if (this.authService.isAuthenticated()) {
      console.log('User is authenticated');
      console.log('Current User:', this.authService.getCurrentUser());
      this.router.navigate(['/home']);
    }
  }

  login(): void {
    this.authService.login(this.username, this.password).subscribe(
      response => {
        console.log('Login successful', response);
        
        this.router.navigate(['/sessions']);  
      },
      error => {
        console.error('Login failed', error);
        this.errorMessage = error.error.message || 'An error occurred during login'; 
      }
    );
  }
}
