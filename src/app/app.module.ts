import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { ResponsableComponent } from './components/responsable/responsable.component';
import { BudgetComponent } from './components/budget/budget.component';
import { HeaderComponent } from './components/header/header.component';
import { MemberComponent } from './components/member/member.component';
import { LoginComponent } from './components/login/login.component';
import { SearchComponent } from './components/search/search.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { HttpClientModule } from '@angular/common/http';
import { LaboratoireComponent } from './components/laboratoire/laboratoire.component';
import { AuthGuardService } from './services/guards/auth-guard.service';
import { NeedComponent } from './components/need/need.component';
import { EmployeProfilComponent } from './components/employe-profil/employe-profil.component';
import { ChartComponent } from './components/chart/chart.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ResponsableComponent,
    BudgetComponent,
    HeaderComponent,
    MemberComponent,
    LoginComponent,
    SearchComponent,
    NotFoundComponent,
    LaboratoireComponent,
    NeedComponent,
    EmployeProfilComponent,
    ChartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ToastrModule.forRoot(),
    ModalModule.forRoot(),
    HttpClientModule,
  ],
  providers: [ToastrService,],
  bootstrap: [AppComponent]
})
export class AppModule { }
