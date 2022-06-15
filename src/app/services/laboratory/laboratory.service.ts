import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';

@Injectable({
  providedIn: 'root'
})
export class LaboratoryService {
  laboratories : any[] = []
  apiBaseUrl : string = "http://localhost:8083/"

  constructor(
    private http: HttpClient
  ) {
    this.getAllFromApi()
  }

  add(laboratory : any){
    let id = this.getNextId()
    laboratory.id = id
    this.laboratories.push(laboratory)
    return id
  }

  edit(laboratory : any){
    let index = this.getIndexById(laboratory.id)
    this.laboratories[index] = laboratory
  }

  getIndexById(id:number){
    for(let i=0;i< this.laboratories.length;i++){
      if(this.laboratories[i].id == id) return i
    }
    return -1
  }


  deleteByid(id : number){
    //delete process in backend and get the new data from api
    let index =this.getIndexById(id)
    if(index != -1){
      this.laboratories.splice(index,1)
    }
  }

  delete(index : number){
    this.laboratories.splice(index,1)
  }

  getItemByIndex(index : number) : undefined | any{
    return this.laboratories[index]
  }

  getItemById(id:number) : undefined | any{
    return this.laboratories.find((laboratory) => {
      return laboratory.id == id
    })
  }

  getAllFromApi(){
    //get laboratories from api
    let laboratories : any[] = []

    this.http.get<any[]>(this.apiBaseUrl+'laboratories').subscribe(
      (response) => {
        this.laboratories = response
        console.log(response)
      },
      (error) => {
        console.log( error)
      }
    )
  }

  getNextId() : number {
    if(this.laboratories.length == 0) return 1
    let id = this.laboratories[this.laboratories.length -1].id+1
    if(!this.idExist(id)) return id
    while(this.idExist(id)){
      id++
    }
    return id
  }

  idExist(id:number) : boolean{
    for(let i=0;i<this.laboratories.length;i++){
      if(this.laboratories[i].id == id) return true
    }
    return false
  }




}
