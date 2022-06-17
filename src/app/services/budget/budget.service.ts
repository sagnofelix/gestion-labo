import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastService } from '../toastr/toast.service';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {

  budgets : any[] = []
  apiBaseUrl : string = "http://localhost:8083/"


  constructor(private toastService : ToastService,private http: HttpClient) {
    this.getAllFromApi()
  }


  add(budget : any){
    this.budgets.push(budget)
  }

  edit(budget : any){
    let index = this.getIndexById(budget.id)
    if(index != -1){
      this.budgets[index] = budget
      return true
    }else{
      this.toastService.showDanger("Aucun budget trouvé pour la modification",'')
      return false
    }
  }

  // delete(id : number):boolean{
  //   let index = this.getIndexById(id)
  //   if(index != -1){
  //     this.budgets.splice(index,1)
  //     return true
  //   }else{
  //     this.toastService.showDanger("Aucun budget trouvé pour la suppression",'')
  //     return false
  //   }
  // }

  delete(id:number){
    //get responsables from api
    return this.http.get<any[]>(this.apiBaseUrl+'budgets/delete?id='+id)
  }

  deleteById(id : number){
    //delete process in backend and get the new data from api
    let index =this.getIndexById(id)
    if(index != -1){
      this.budgets.splice(index,1)
    }
  }

  getIndexById(id:number){
    for(let i=0;i< this.budgets.length;i++){
      if(this.budgets[i].id == id) return i
    }
    return -1
  }

  getItemByIndex(index : number) : undefined | any{
    return this.budgets[index]
  }

  getItemById(id:number) : undefined | any{
    return this.budgets.find((budget) => {
      return budget.id == id
    })
  }

  // getAllFromApi(){
  //   //get budgets from api
  //   let budgets : any[] = []

  //   this.budgets = budgets
  // }

  getNextId() : number {
    if(this.budgets.length == 0) return 1
    let id = this.budgets[this.budgets.length -1].id+1
    if(!this.idExist(id)) return id
    while(this.idExist(id)){
      id++
    }
    return id
  }

  idExist(id:number) : boolean{
    for(let i=0;i<this.budgets.length;i++){
      if(this.budgets[i].id == id) return true
    }
    return false
  }

  getAllFromApi(){
    return this.http.get<any[]>(this.apiBaseUrl+'budgets')
  }
}
