import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { DecodedToken } from './DecodedToken'; 

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = 'http://localhost:9191';
  private readonly registerUrl = 'http://localhost:4000/api/users';
  private currentUser: DecodedToken | null = null;

  constructor(private http: HttpClient, private jwtHelper: JwtHelperService) {
    this.loadUserFromToken();
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/authenticate`, { username, password })
      .pipe(
        map((response: any) => {
          if (response) {
            localStorage.setItem('token', response.token);
            this.loadUserFromToken();
          }
          return response;
        })
      );
  }

  register(username: string, password: string, email: string): Observable<any> {
    return this.http.post<any>(`${this.registerUrl}/register`, { username, password, email });
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token && !this.jwtHelper.isTokenExpired(token);
  }

  getCurrentUser(): any {
    return this.currentUser;
  }

  private loadUserFromToken(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.currentUser = this.jwtHelper.decodeToken(token) as DecodedToken;
      this.currentUser.token = token;
      console.log('Decoded token:', this.currentUser); 
    } else {
      console.log('No token found'); 
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    this.currentUser = null;
  }
}
