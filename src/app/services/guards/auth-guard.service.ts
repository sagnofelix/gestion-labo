import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { ToastService } from '../toastr/toast.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(
    private authService : AuthService,
    private router : Router,
    private toastService : ToastService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean  | Observable<boolean> | Promise<boolean>  {
    if(this.authService.isAuthenticated) {
      return true
    }else{
      this.toastService.showDanger("Accès non autorisé , connectez-vous pour avoir l'accès à la page demandée.","")
      //this.router.navigate(['/login'],{ queryParams: { returnUrl: state.url }})
      this.router.navigate(['/login'])
      return false
    }
  }
}
