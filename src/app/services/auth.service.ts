import { Injectable } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from '@angular/fire/auth';

export interface User {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  users: string = '';
  goggle = new GoogleAuthProvider();
  constructor(private auth: Auth) {}

  async register({ email, password }: User) {
    try {
      const user = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      return 'registered';
    } catch (e) {
      return null;
    }
  }

  async login({ email, password }: User) {
    try {
      const user = await signInWithEmailAndPassword(this.auth, email, password);
      this.users = user.user.email!;
      return 'Logged in';
    } catch (e) {
      return null;
    }
  }

  async google() {
    try {
      const user = await signInWithPopup(this.auth, this.goggle);
      this.users = user.user.email!;
      return "signed in with google authentication"
    } catch (e) {
      return e
    }
  }

  async logout() {
    await signOut(this.auth).then(() => {
      return 'signed out';
    }).catch((err) => {
      throw new Error(err);
    })
  }
}
