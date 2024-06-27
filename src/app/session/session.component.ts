import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from '../session.service';
import { User } from '../user';
import { Session } from '../session';
import { Restaurant } from '../restaurant';
import { AuthService } from '../AuthService';
import { DecodedToken } from '../DecodedToken';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.css']
})
export class SessionComponent implements OnInit {
  activeSessions: Session[] = [];
  restaurants: Restaurant[] = [];
  randomRestaurant: Restaurant | null = null;
  invitedUsers: User[] = [];

  sessionName: string = ''; 
  username: string = ''; 
  sessionIdForRestaurant: number | null = null; 
  restaurantName: string = ''; 
  sessionIdForRestaurants: number | null = null; 
  sessionIdToPick: number | null = null; 
  inviteUsername: string = ''; 
  sessionIdToInvite: number | null = null; 
  currentUser: DecodedToken | null = null; 

  errorMessageActiveSessions: string = '';
  errorMessageCreateSession: string = '';
  errorMessageInviteUser: string = '';
  errorMessageSubmitRestaurant: string = '';
  successMessageSubmitRestaurant: string = '';

  constructor(private sessionService: SessionService, 
              private authService: AuthService,
              private router: Router) { }

  ngOnInit(): void {
    this.loadActiveSessions();
    this.currentUser = this.authService.getCurrentUser();
    console.log('Current user##', this.currentUser); 
  }

  loadActiveSessions(): void {
    this.sessionService.getActiveSessions().subscribe(sessions => {
      this.activeSessions = sessions;
      if (this.activeSessions.length > 0) {
        this.loadInvitedUsers(this.activeSessions[0].id);
        this.errorMessageActiveSessions = ''; 
      } else {
        this.errorMessageActiveSessions = 'No Active sessions';
      }
    }, error => {
      console.error('Error loading active sessions:', error);
      this.errorMessageActiveSessions = 'Error loading active sessions';
    });
  }

  registerUser(): void {
    const newUser: User = { username: 'Karokey', password: 'karo123', email: 'karokey@gmail.com' };
    this.sessionService.registerUser(newUser).subscribe(user => {
      console.log('Registered User:', user);
    });
  }

  createSession(): void {
    this.sessionService.createSession(this.sessionName, this.username).subscribe({
      next: session => {
        console.log('Created Session:', session);
        this.loadActiveSessions(); 
        this.errorMessageCreateSession = ''; 
      },
      error: error => {
        console.error('Error creating session:', error);
        this.errorMessageCreateSession = error; 
      }
    });
  }

  endSession(sessionId: number): void {
    this.sessionService.endSession(sessionId).subscribe(() => {
      console.log('Session Ended');
      this.loadActiveSessions(); 
    });
  }

  submitRestaurant(): void {
    if (this.sessionIdForRestaurant !== null) {
      this.sessionService.submitRestaurant(this.sessionIdForRestaurant, this.restaurantName, this.username).subscribe(restaurant => {
        console.log('Submitted Restaurant:', restaurant);
        this.successMessageSubmitRestaurant = `Restaurant "${restaurant.name}" submitted successfully!`;
        this.errorMessageSubmitRestaurant = ''; 
      }, error => {
        console.error('Error submitting restaurant:', error);
        this.errorMessageSubmitRestaurant = 'Error submitting restaurant';
        this.successMessageSubmitRestaurant = ''; 
      });
    }
  }  

  getRestaurants(): void {
    if (this.sessionIdForRestaurants !== null) {
      this.sessionService.getRestaurants(this.sessionIdForRestaurants).subscribe(restaurants => {
        this.restaurants = restaurants;
      });
    }
  }

  pickRandomRestaurant(): void {
    if (this.sessionIdToPick !== null) {
      this.sessionService.pickRandomRestaurant(this.sessionIdToPick).subscribe(restaurant => {
        this.randomRestaurant = restaurant;
        console.log('Picked Random Restaurant:', restaurant);
      });
    }
  }

  inviteUserToSession(): void {
    if (this.sessionIdToInvite !== null) {
      this.sessionService.inviteUserToSession(this.sessionIdToInvite, this.inviteUsername).subscribe(
        () => {
          console.log('User Invited');
          this.errorMessageInviteUser = ''; 
          if (this.sessionIdToInvite !== null) {
            this.loadInvitedUsers(this.sessionIdToInvite); 
          }
        },
        (error) => {
          console.error('Error inviting user', error);
          this.errorMessageInviteUser = error;
        }
      );
    } else {
      console.error('Session ID is null');
      this.errorMessageInviteUser = 'Session ID is null';
    }
  }

  loadInvitedUsers(sessionId: number): void {
    this.sessionService.getInvitedUsers(sessionId).subscribe(users => {
      this.invitedUsers = users;
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
    
  }  

  isInitiatedByCurrentUser(session: Session): boolean {
    console.log('current user::'+this.currentUser?.sub);
    return this.currentUser !== null && session.initiatedBy.username === this.currentUser.sub;
  }
}
