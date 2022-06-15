import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ToastService } from 'src/app/services/toastr/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  userInfo : any = {
    email : "",
    password : "",
    type : ""
  }

  returnUrl: string = "";

  apiBaseUrl : string = "http://localhost:8083/"

  constructor(
    private toastService : ToastService,
    private authService:AuthService,
    private router : Router,
    private route: ActivatedRoute,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.returnUrl = params['returnUrl'] || '/'
    });
  }



  connect(){
    if(!this.vallidateInputs()){
      this.toastService.showDanger("Veillez fournir toutes informations requises","")
    }else{
      if(this.vallidateInputs()){
        this.http.post<any>(this.apiBaseUrl+'login', this.userInfo).subscribe(
          (data:any) => {
            if(data.id == 0){
              this.toastService.showDanger(data.email,"")
            }else{
              data.type = this.userInfo.type
              console.log(data)
              this.authService.connect(true,data)
              this.router.navigateByUrl(this.returnUrl);
            }
          },
          (error) => {
            console.log(error)
          }
        )
      }else{
        this.toastService.showDanger("Remplissez tous les champs.",'')
      }
      //this.authService.connect(true,this.userInfo)
      //this.router.navigateByUrl(this.returnUrl);
    }
  }

  vallidateInputs(){
    return this.userInfo.email != "" && this.userInfo.password != "" && this.userInfo.type != ""
  }

}
