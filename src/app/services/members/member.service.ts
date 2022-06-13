import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Member } from 'src/app/interfaces/members';
import { ToastService } from '../toastr/toast.service';

@Injectable({
  providedIn: 'root'
})
export class MemberService {

  members : any[] = []

  constructor(private toastService : ToastService) {
    this.getAllFromApi()
  }


  add(member : any){
    member.id = this.getNextId()
    this.members.push(member)
  }

  edit(member : any){
    let index = this.getIndexById(member.id)
    this.members[index] = member
  }

  delete(index : number){
    this.members.splice(index,1)
  }

  deleteById(id : number){
    //delete process in backend and get the new data from api 
    let index =this.getIndexById(id)
    if(index != -1){
      this.members.splice(index,1)
    }
  }

  getIndexById(id:number){
    for(let i=0;i< this.members.length;i++){
      if(this.members[i].id == id) return i
    }
    return -1
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
    //get members from api
    let members : any[] = []

    this.members = members
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
