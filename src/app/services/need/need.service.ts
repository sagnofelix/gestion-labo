import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastService } from '../toastr/toast.service';

@Injectable({
  providedIn: 'root'
})
export class NeedService {

  needs : any[] = []
  apiBaseUrl : string = "http://localhost:8083/"


  constructor(private toastService : ToastService,private http: HttpClient) {
    this.getAllFromApi()
  }


  add(need : any){
    this.needs.push(need)
  }

  edit(need : any){
    let index = this.getIndexById(need.id)
    if(index != -1){
      this.needs[index] = need
      return true
    }else{
      this.toastService.showDanger("Aucun besoin trouvé pour la modification",'')
      return false
    }
  }

  delete(id:number){
    return this.http.get<any[]>(this.apiBaseUrl+'needs/delete/'+id)
  }

  deleteById(id : number){
    //delete process in backend and get the new data from api
    let index =this.getIndexById(id)
    if(index != -1){
      this.needs.splice(index,1)
    }
  }

  getIndexById(id:number){
    for(let i=0;i< this.needs.length;i++){
      if(this.needs[i].id == id) return i
    }
    return -1
  }

  getItemByIndex(index : number) : undefined | any{
    return this.needs[index]
  }

  getItemById(id:number) : undefined | any{
    return this.needs.find((need) => {
      return need.id == id
    })
  }

  // getAllFromApi(){
  //   //get needs from api
  //   let needs : any[] = []

  //   this.needs = needs
  // }

  getNextId() : number {
    if(this.needs.length == 0) return 1
    let id = this.needs[this.needs.length -1].id+1
    if(!this.idExist(id)) return id
    while(this.idExist(id)){
      id++
    }
    return id
  }

  idExist(id:number) : boolean{
    for(let i=0;i<this.needs.length;i++){
      if(this.needs[i].id == id) return true
    }
    return false
  }

  getAllFromApi(){
    return this.http.get<any[]>(this.apiBaseUrl+'needs')
  }
}
