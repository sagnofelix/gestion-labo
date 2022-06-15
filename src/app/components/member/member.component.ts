import { HttpClient } from '@angular/common/http';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { MemberService } from 'src/app/services/members/member.service';
import { ToastService } from 'src/app/services/toastr/toast.service';

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.css']
})
export class MemberComponent implements OnInit {

  members : any = []

  memberItem : any = {
    name : null,
    id : null,
    firsname : null,
    email : null,
    phone:null,
    laboratoryId : null,
  }

  memberItemCopy : any = {
    name : null,
    id : null,
    firstname : null,
    email : null,
    phone:null,
    laboratoryId : null,
  }

  currentMember : any = null
  currentSelectedId : any = null
  fullname : any = null


  modalRef? : BsModalRef
  modalEditRef? : BsModalRef
  modalDeleteRef? : BsModalRef
  modalDetailsRef? : BsModalRef

  apiBaseUrl : string = "http://localhost:8083/"



  constructor(
    private memberService : MemberService,
    private modalService : BsModalService,
    private toastService : ToastService,
    private http: HttpClient
  ) {
    this.getAllFromService()
  }

  ngOnInit(): void {
  }

  getAllFromService(){
    this.members = this.memberService.members
  }

  openAddModal(template : TemplateRef<any>){
    let config = {
      backdrop: true,
      ignoreBackdropClick: true
    };
    this.modalRef = this.modalService.show(template,config)
  }

  openEditModal(template : TemplateRef<any>,id:number){
    this.currentSelectedId = id
    let index = this.getIndex(this.currentSelectedId)
    this.currentMember = this.members[index]
    this.fullname = this.currentMember.name + " " + this.currentMember.firstname
    console.log(this.currentMember)
    let config = {
      backdrop: true,
      ignoreBackdropClick: true
    };
    this.modalEditRef = this.modalService.show(template,config)
  }



  openDeleteModal(template : TemplateRef<any>,id:number){
    this.currentSelectedId = id
    let index = this.getIndex(this.currentSelectedId)
    this.currentMember = this.members[index]
    let config = {
      backdrop: true,
      ignoreBackdropClick: true
    };
    this.modalDeleteRef = this.modalService.show(template)
  }

  openDetailsModal(template : TemplateRef<any>,id:number){
    this.currentSelectedId = id
    let index = this.getIndex(this.currentSelectedId)
    this.currentMember = this.members[index]

    let config = {
      backdrop: true,
      ignoreBackdropClick: true
    };
    this.modalDetailsRef = this.modalService.show(template)
  }

  add(){
    if(this.vallidateInputs()){
      this.http.post<any>(this.apiBaseUrl+'persons/add?type=Employé', this.memberItem).subscribe(
        (data:any) => {
          if(data.id == 0){
            this.toastService.showDanger(data.email,"")
          }else{
            data.type = this.memberItem.type
            this.memberService.add(this.memberItem)
            this.memberItem = this.memberItemCopy
            this.members = this.memberService.members
            this.toastService.showInfo("Membre ajouté avec succès","")
            this.modalRef?.hide()
          }
        },
        (error) => {
          console.log(error)
        }
      )
    }else{
      this.toastService.showDanger("Donnez les informations recquises.",'')
    }


  }

  edit(){
    let result = this.memberService.edit(this.currentMember)
    if(!result) return
    this.members = this.memberService.members
    this.toastService.showInfo("Modification effectuée avec succès","")
    this.modalEditRef?.hide()
    this.currentMember = null
    this.currentSelectedId = null
  }


  delete(){
    let result = this.memberService.delete(this.currentSelectedId)
    if(!result) return
    this.members = this.memberService.members
    this.toastService.showInfo("Suppression effectuée avec succès","")
    this.modalDeleteRef?.hide()
    this.currentMember = null
    this.currentSelectedId = null

  }

  getIndex(id:number){
    for(let i=0;i< this.members.length;i++){
      if(this.members[i].id == id) return i
    }
    return -1
  }

  closeDetailsModal(){
    this.modalDetailsRef?.hide()
    this.currentMember = null
    this.currentSelectedId = null
  }

  vallidateInputs(){
    return this.memberItem.email != null && this.memberItem.phone != null && this.memberItem.password != null && this.memberItem.name != null && this.memberItem.firstname != null
  }
}
