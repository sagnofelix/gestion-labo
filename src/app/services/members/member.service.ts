import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastService } from '../toastr/toast.service';

@Injectable({
  providedIn: 'root'
})
export class MemberService {

  members : any[] = []

  apiBaseUrl : string = "http://localhost:8083/"

  constructor(
    private toastService : ToastService,
    private http: HttpClient
  ) {
    this.getAllFromApi().subscribe((members) => {
      this.members = members
    },(err) => {console.log(err)})
  }

  add(member : any){
    this.members.push(member)
  }

  edit(member : any) : boolean{
    let index = this.getIndexById(member.id)
    if(index != -1){
      this.members[index] = member
      return true
    }else{
      this.toastService.showDanger("Aucun employé trouvé pour la modification","")
      return false
    }
  }

  getIndexById(id:number){
    for(let i=0;i< this.members.length;i++){
      if(this.members[i].id == id) return i
    }
    return -1
  }

  updateLaboratoryId(member : any){
    let index =this.getIndexById(member.id)
    if(index != -1){
      this.members[index] = member
    }
  }

  deleteById(id : number){
    let index =this.getIndexById(id)
    if(index != -1){
      this.members.splice(index,1)
    }
  }

  getItemByIndex(index : number) : undefined | any{
    return this.members[index]
  }

  getItemById(id:number) : undefined | any{
    return this.members.find((member) => {
      return member.id == id
    })
  }

  getAllFromApi(){
    return this.http.get<any[]>(this.apiBaseUrl+'employes')
  }

  getOneFromApi(id:number){
    return this.http.get<any>(this.apiBaseUrl+'employes/'+id)
  }

  delete(id:number){
    return this.http.get<any[]>(this.apiBaseUrl+'employes/delete/'+id)
  }

  changePassword(id:number, password:string){
    return this.http.get<any[]>(this.apiBaseUrl+'employes/change-password/'+id+"/"+password)
  }

  getNextId() : number {
    if(this.members.length == 0) return 1
    let id = this.members[this.members.length -1].id+1
    if(!this.idExist(id)) return id
    while(this.idExist(id)){
      id++
    }
    return id
  }

  idExist(id:number) : boolean{
    for(let i=0;i<this.members.length;i++){
      if(this.members[i].id == id) return true
    }
    return false
  }

}
