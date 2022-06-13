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

  constructor(
    private toastService : ToastService,
    private authService:AuthService,
    private router : Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.returnUrl = params['returnUrl'] || '/'
    });
    console.log(this.returnUrl)
  }

  

  connect(){
    console.log(this.returnUrl)
    if(!this.vallidateInputs()){
      this.toastService.showDanger("Veillez fournir toutes informations requises","")
    }else{
      console.log(this.userInfo)
      this.authService.connect(true,this.userInfo)
      this.router.navigateByUrl(this.returnUrl);
    }
  }

  vallidateInputs(){
    return this.userInfo.email != "" && this.userInfo.password != "" && this.userInfo.type
  }

}
