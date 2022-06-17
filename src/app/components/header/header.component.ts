import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(public authService : AuthService,private router : Router) { }

  ngOnInit(): void {
  }

  query : any

  onSignOut(){
    this.authService.signOut()
    this.router.navigate(['login'])
    console.log(this.authService.isAuthenticated)
  }

  search(){

  }

  showLaboLink() : boolean {
    return this.authService.user.type=="Administrateur"
  }

  showResponsableLink() : boolean {
    return this.authService.user.type=="Responsable"
  }

  showEmploye() : boolean {
    return this.authService.user.type=="Employé"
  }

}
