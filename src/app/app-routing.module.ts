import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BudgetComponent } from './components/budget/budget.component';
import { HomeComponent } from './components/home/home.component';
import { LaboratoireComponent } from './components/laboratoire/laboratoire.component';
import { LoginComponent } from './components/login/login.component';
import { MemberComponent } from './components/member/member.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { ResponsableComponent } from './components/responsable/responsable.component';
import { SearchComponent } from './components/search/search.component';
import { AuthGuardService } from './services/guards/auth-guard.service';
import { IsAdminGuardService } from './services/guards/is-admin-guard.service';
import { IsResponsableGuardService } from './services/guards/is-responsable-guard.service';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { 
    path: 'responsable', 
    component: ResponsableComponent ,
    // canActivate: [
    //   AuthGuardService,IsAdminGuardService
    // ]
  },
  { 
    path: 'laboratoires', 
    component: LaboratoireComponent ,
    //canActivate:[AuthGuardService,IsAdminGuardService] 
  },
  { 
    path: 'budgets', component: BudgetComponent , 
    //canActivate:[AuthGuardService,IsResponsableGuardService]
  },
  { 
    path: 'members', component: MemberComponent , 
    //canActivate:[AuthGuardService]
  },
  { path: 'search', component: SearchComponent },
  { path: 'login', component: LoginComponent },
  { path: 'not-found', component: NotFoundComponent },
  { path: '**', redirectTo :'not-found' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
