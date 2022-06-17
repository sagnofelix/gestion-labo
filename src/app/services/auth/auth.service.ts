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
    localStorage.removeItem('user')
  }

  connect(state : boolean , user : any){
    localStorage.setItem("user",JSON.stringify(user))
    this.isAuthenticated = state
    this.user = user
  }

  constructor() { }

  loginFromLocalStorage(){
    let user :any = localStorage.getItem('user')
    if(user){
      this.isAuthenticated = true
      this.user = JSON.parse(user)
    }
  }
}
