import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from '@angular/fire/auth';
import { Router } from '@angular/router'
import { createUserWithEmailAndPassword } from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userLoggedIn = false;
  currentUser = new BehaviorSubject<User | null>(null);

  constructor(private auth: Auth, private router: Router) {
    onAuthStateChanged(this.auth, (user) => {
      this.userLoggedIn = !!user;
      this.currentUser.next(user);
    });
  }

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logout() {
    return signOut(this.auth).then(() => {
      this.router.navigate(['/']);
    });
  }
  createUser(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }
  isLoggedIn(): boolean {
    return this.userLoggedIn;
  }
  getCurrentUser(): User | null {
    return this.currentUser.value;
  }
}
