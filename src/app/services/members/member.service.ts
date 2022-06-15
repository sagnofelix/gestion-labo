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
    this.getAllFromApi()
  }


  add(member : any){
    member.id = this.getNextId()
    this.members.push(member)
  }

  edit(member : any) : boolean{
    let index = this.getIndexById(member.id)
    if(index != -1){
      this.members[index] = member
      return true
    }else{
      this.toastService.showDanger("Aucun membre trouvé pour la modification","")
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
    //delete process in backend and get the new data from api
    let index =this.getIndexById(id)
    if(index != -1){
      this.members.splice(index,1)
    }
  }

  delete(id : number){
    let index = this.getIndexById(id)
    if(index != -1){
      this.members.splice(index,1)
      return true
    }else{
      this.toastService.showDanger("Aucun membre trouvé pour la suppression",'')
      return false
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
    this.http.get<any[]>(this.apiBaseUrl+'employes').subscribe(
      (response) => {
        this.members = response
      },
      (error) => {
        console.log( error)
      }
    )

  }

  getEnabledMembers(){
    let members : any[] = []
    for(let i=0;i<this.members.length;i++){
      let item = this.members[i]
      if(item.laboratoryId == null){
        members.push(item)
      }
    }
    return members
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
