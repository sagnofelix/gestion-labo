import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ResponsableService } from 'src/app/services/responsable/responsable.service';
import { ToastService } from 'src/app/services/toastr/toast.service';

@Component({
  selector: 'app-responsable',
  templateUrl: './responsable.component.html',
  styleUrls: ['./responsable.component.css']
})
export class ResponsableComponent implements OnInit {

  responsables : any = []

  responsableItem : any = {
    name : null,
    id : null,
    firsname : null,
    email : null,
    phone:null,
    laboratoryId : null,
  }

  responsableItemCopy : any = {
    name : null,
    id : null,
    firstname : null,
    email : null,
    phone:null,
    laboratoryId : null,
  }

  currentResponsable : any = null
  currentSelectedId : any = null
  fullname : any = null


  modalRef? : BsModalRef
  modalEditRef? : BsModalRef
  modalDeleteRef? : BsModalRef
  modalDetailsRef? : BsModalRef



  constructor(
    private responsableService : ResponsableService,
    private modalService : BsModalService,
    private toastService : ToastService
  ) {
    this.getAllFromService()
  }

  ngOnInit(): void {
  }

  getAllFromService(){
    this.responsables = this.responsableService.responsables
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
    this.currentResponsable = this.responsables[index]
    this.fullname = this.currentResponsable.name + " " + this.currentResponsable.firstname
    console.log(this.currentResponsable)
    let config = {
      backdrop: true,
      ignoreBackdropClick: true
    };
    this.modalEditRef = this.modalService.show(template,config)
  }

  

  openDeleteModal(template : TemplateRef<any>,id:number){
    this.currentSelectedId = id
    let index = this.getIndex(this.currentSelectedId)
    this.currentResponsable = this.responsables[index]
    let config = {
      backdrop: true,
      ignoreBackdropClick: true
    };
    this.modalDeleteRef = this.modalService.show(template)
  }

  openDetailsModal(template : TemplateRef<any>,id:number){
    this.currentSelectedId = id
    let index = this.getIndex(this.currentSelectedId)
    this.currentResponsable = this.responsables[index]

    let config = {
      backdrop: true,
      ignoreBackdropClick: true
    };
    this.modalDetailsRef = this.modalService.show(template)
  }

  add(){
    this.responsableService.add(this.responsableItem)
    this.responsableItem = this.responsableItemCopy
    this.responsables = this.responsableService.responsables
    this.toastService.showInfo("Responsable ajouté avec succès","")
    this.modalRef?.hide()
  }

  edit(){
    let result = this.responsableService.edit(this.currentResponsable)
    if(!result) return
    this.responsables = this.responsableService.responsables
    this.toastService.showInfo("Modification effectuée avec succès","")
    this.modalEditRef?.hide()
    this.currentResponsable = null
    this.currentSelectedId = null
  }

  
  delete(){
    let result = this.responsableService.delete(this.currentSelectedId)
    if(!result) return
    this.responsables = this.responsableService.responsables
    this.toastService.showInfo("Suppression effectuée avec succès","")
    this.modalDeleteRef?.hide()
    this.currentResponsable = null
    this.currentSelectedId = null
    
  }

  getIndex(id:number){
    for(let i=0;i< this.responsables.length;i++){
      if(this.responsables[i].id == id) return i
    }
    return -1
  }

  closeDetailsModal(){
    this.modalDetailsRef?.hide()
    this.currentResponsable = null
    this.currentSelectedId = null
  }
}
