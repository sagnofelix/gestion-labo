import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { LaboratoryService } from 'src/app/services/laboratory/laboratory.service';
import { MemberService } from 'src/app/services/members/member.service';
import { ResponsableService } from 'src/app/services/responsable/responsable.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  user :any = null
  laboratories : any = [];
  members : any = [];
  responsables : any = [];

  loading = true

  constructor(
    private laboratoryService : LaboratoryService,
    private authService: AuthService,
    private memberService : MemberService,
    private responsableService : ResponsableService,
  ) {
    this.user = authService.user
   }

  ngOnInit(): void {
    this.laboratoryService.getAllFromApi().subscribe((laboratories) => {
      this.laboratories = laboratories
      this.responsableService.getAllFromApi().subscribe((responsables) => {
        this.responsables = responsables
        this.memberService.getAllFromApi().subscribe((members) => {
          this.members = members
          this.loading = false
        },(err) => {console.log(err)})
      })
    },(err) => {console.log(err)})
  }



}
