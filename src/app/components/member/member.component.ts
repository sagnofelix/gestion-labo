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
    name : "",
    id : 0,
    responsableId : ""
  }

  currentMember : any = null
  currentIndex : any = null

  modalRef? : BsModalRef
  modalEditRef? : BsModalRef
  modalDeleteRef? : BsModalRef
  modalDetailsRef? : BsModalRef



  constructor(
    private memberService : MemberService,
    private modalService : BsModalService,
    private toastService : ToastService
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

  openEditModal(template : TemplateRef<any>,index:number){
    this.currentIndex = index
    this.currentMember = this.members[index]
    console.log(this.currentMember)
    let config = {
      backdrop: true,
      ignoreBackdropClick: true
    };
    this.modalEditRef = this.modalService.show(template,config)
  }

  openDeleteModal(template : TemplateRef<any>,index:number){
    this.currentIndex = index
    this.currentMember = this.members[index]
    let config = {
      backdrop: true,
      ignoreBackdropClick: true
    };
    this.modalDeleteRef = this.modalService.show(template)
  }

  openDetailsModal(template : TemplateRef<any>,index:number){
    this.currentIndex = index
    this.currentMember = this.members[index]
    let config = {
      backdrop: true,
      ignoreBackdropClick: true
    };
    this.modalDetailsRef = this.modalService.show(template)
  }

  add(){
    this.memberService.add(this.memberItem)
    this.memberItem = {
      name : "",
      id : 0,
      responsableId : ""
    }
    this.members = this.memberService.members
    this.toastService.showInfo("Membre ajouté avec succès","")
    this.modalRef?.hide()
  }

  edit(){
    this.memberService.edit(this.currentMember)
    this.members = this.memberService.members
    this.toastService.showInfo("Modification effectuée avec succès","")
    this.modalEditRef?.hide()
    this.currentMember = null
    this.currentIndex = null
  }

  
  delete(){
    this.memberService.delete(this.currentIndex)
    this.members = this.memberService.members
    this.toastService.showInfo("Suppression effectuée avec succès","")
    this.modalDeleteRef?.hide()
    this.currentMember = null
    this.currentIndex = null
  }

  closeDetailsModal(){
    this.modalDetailsRef?.hide()
    this.currentMember = null
    this.currentIndex = null
  }

}
