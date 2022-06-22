import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastService } from '../toastr/toast.service';

@Injectable({
  providedIn: 'root'
})
export class ResponsableService {
  responsables : any[] = []
  apiBaseUrl : string = "http://localhost:8083/"

  constructor(
    private toastService : ToastService,
    private http: HttpClient
  ) {
    // this.getAllFromApi().subscribe((responsables) => {
    //   this.responsables = responsables
    // },(err) => {console.log(err)})
  }

  add(responsable : any){
    this.responsables.push(responsable)
  }

  edit(responsable : any) : boolean{
    let index = this.getIndexById(responsable.id)
    if(index != -1){
      this.responsables[index] = responsable
      return true
    }else{
      this.toastService.showDanger("Aucun responsable trouvé pour la modification","")
      return false
    }
  }

  getIndexById(id:number){
    for(let i=0;i< this.responsables.length;i++){
      if(this.responsables[i].id == id) return i
    }
    return -1
  }

  updateLaboratoryId(responsable : any){
    let index =this.getIndexById(responsable.id)
    if(index != -1){
      this.responsables[index] = responsable
    }
  }

  deleteById(id : number){
    let index =this.getIndexById(id)
    if(index != -1){
      this.responsables.splice(index,1)
    }
  }

  getItemByIndex(index : number) : undefined | any{
    return this.responsables[index]
  }

  getItemById(id:number) : undefined | any{
    return this.responsables.find((responsable) => {
      return responsable.id == id
    })
  }

  getAllFromApi(){
    return this.http.get<any[]>(this.apiBaseUrl+'responsables')
  }

  getEnabledFromApi(){
    return this.http.get<any[]>(this.apiBaseUrl+'responsables/enabled')
  }

  delete(id:number){
    return this.http.get<any[]>(this.apiBaseUrl+'responsables/delete/'+id)
  }

  getNextId() : number {
    if(this.responsables.length == 0) return 1
    let id = this.responsables[this.responsables.length -1].id+1
    if(!this.idExist(id)) return id
    while(this.idExist(id)){
      id++
    }
    return id
  }

  idExist(id:number) : boolean{
    for(let i=0;i<this.responsables.length;i++){
      if(this.responsables[i].id == id) return true
    }
    return false
  }
}
