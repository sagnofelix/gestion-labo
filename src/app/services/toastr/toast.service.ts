

import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root' //global injection of the service in the project
})
export class ToastService {

  //dependency injection of ToastrService in our own service.
  constructor(private toastrService : ToastrService) {} 

  //Create our helpers functions to make our life easy
  showSucces(message:string,header:string){
    this.toastrService.success(message,header)
  }

  showDanger(message:string,header:string){
    this.toastrService.error(message,header)
  }

  showInfo(message:string,header:string){
    this.toastrService.info(message,header)
  }

  showWarning(message:string,header:string){
    this.toastrService.warning(message,header)
  }

}
