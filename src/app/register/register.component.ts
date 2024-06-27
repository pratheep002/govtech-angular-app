import { Component } from '@angular/core';
import { AuthService } from '../AuthService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username: string = '';
  password: string = '';
  email: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  register(): void {
    this.authService.register(this.username, this.password, this.email).subscribe(
      () => {
        console.log('User registered successfully');
        this.router.navigate(['/login']);
      },
      error => {
        console.error('Error registering user', error);
      }
    );
  }
}
