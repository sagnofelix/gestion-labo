import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { ToastService } from '../toastr/toast.service';

@Injectable({
  providedIn: 'root'
})
export class IsAdminGuardService {

  constructor(
    private authService : AuthService,
    private router : Router,
    private toastService : ToastService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean  | Observable<boolean> | Promise<boolean>  {
    if(this.authService.user.type=="Administrateur") {
      return true
    }else{
      this.authService.signOut()
      this.toastService.showDanger("Accès réservé à l'administrateur , connectez-vous pour avoir l'accès à la page demandée.","")
      this.router.navigate(['/login'],{ queryParams: { returnUrl: state.url }})
      return false
    }
  }
}
