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
    this.getAllFromApi()
  }


  add(responsable : any){
    responsable.id = this.getNextId()
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
    //delete process in backend and get the new data from api
    let index =this.getIndexById(id)
    if(index != -1){
      this.responsables.splice(index,1)
    }
  }

  delete(id : number){
    let index = this.getIndexById(id)
    if(index != -1){
      this.responsables.splice(index,1)
      return true
    }else{
      this.toastService.showDanger("Aucun responsable trouvé pour la suppression",'')
      return false
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
    //get responsables from api
    this.http.get<any[]>(this.apiBaseUrl+'responsables').subscribe(
      (response) => {
        this.responsables = response
        console.log(response)
      },
      (error) => {
        console.log( error)
      }
    )

  }

  getEnabledResponsables(){
    let responsables : any[] = []
    for(let i=0;i<this.responsables.length;i++){
      let item = this.responsables[i]
      if(item.laboratoryId == null){
        responsables.push(item)
      }
    }
    return responsables
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
