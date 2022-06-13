import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isAuthenticated : boolean = false
  user  : any = {}

  signOut(){
    this.isAuthenticated = false
    this.user = {}
  }

  connect(state : boolean , user : any){
    this.isAuthenticated = state
    this.user = user
  }

  constructor() { }
}
