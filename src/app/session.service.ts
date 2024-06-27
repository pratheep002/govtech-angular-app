import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from './user'; 
import { Session } from './session'; 
import { Restaurant } from './restaurant'; 

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private apiUrl = 'http://localhost:4000/api'; 

  constructor(private http: HttpClient) { }

  registerUser(user: User): Observable<User> {
    const url = `${this.apiUrl}/users/register`;
    return this.http.post<User>(url, user);
  }

  createSession(sessionName: string, username: string): Observable<Session> {
    const url = `${this.apiUrl}/sessions/create?sessionName=${sessionName}&username=${username}`;
    return this.http.post<Session>(url, {})
      .pipe(
        catchError(this.handleError)
      );
  }

  endSession(sessionId: number): Observable<void> {
    const url = `${this.apiUrl}/sessions/${sessionId}/end`;
    return this.http.post<void>(url, {})
      .pipe(
        catchError(this.handleError)
      );
  }

  getActiveSessions(): Observable<Session[]> {
    const url = `${this.apiUrl}/sessions/active`;
    return this.http.get<Session[]>(url)
      .pipe(
        catchError(this.handleError)
      );
  }

  submitRestaurant(sessionId: number, restaurantName: string, username: string): Observable<Restaurant> {
    const url = `${this.apiUrl}/sessions/${sessionId}/restaurants?restaurantName=${restaurantName}&username=${username}`;
    return this.http.post<Restaurant>(url, {})
      .pipe(
        catchError(this.handleError)
      );
  }

  getRestaurants(sessionId: number): Observable<Restaurant[]> {
    const url = `${this.apiUrl}/sessions/${sessionId}/restaurants`;
    return this.http.get<Restaurant[]>(url)
      .pipe(
        catchError(this.handleError)
      );
  }

  pickRandomRestaurant(sessionId: number): Observable<Restaurant> {
    const url = `${this.apiUrl}/sessions/${sessionId}/pick`;
    return this.http.get<Restaurant>(url)
      .pipe(
        catchError(this.handleError)
      );
  }

  inviteUserToSession(sessionId: number, username: string): Observable<void> {
    const url = `${this.apiUrl}/sessions/${sessionId}/invite?username=${username}`;
    return this.http.post<void>(url, {})
      .pipe(
        catchError(this.handleError)
      );
  }

  getInvitedUsers(sessionId: number): Observable<User[]> {
    const url = `${this.apiUrl}/sessions/${sessionId}/invited-users`;
    return this.http.get<User[]>(url)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred.
      errorMessage = `An error occurred: ${error.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      if (error.status === 404) {
        errorMessage = error.error.message || 'User not found with the provided username.';
      }
    }
    return throwError(errorMessage);
  }  

}
