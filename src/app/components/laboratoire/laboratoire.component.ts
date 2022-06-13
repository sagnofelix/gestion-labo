import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { LaboratoryService } from 'src/app/services/laboratory/laboratory.service';
import { ResponsableService } from 'src/app/services/responsable/responsable.service';
import { ToastService } from 'src/app/services/toastr/toast.service';

@Component({
  selector: 'app-laboratoire',
  templateUrl: './laboratoire.component.html',
  styleUrls: ['./laboratoire.component.css']
})
export class LaboratoireComponent implements OnInit {
  laboratories : any[] = []
  responsables : any[] = []


  selectedResponsableId = null
  laboratoryItem : any = {
    name : "",
    id : null,
    phone : "",
    address : "",
    responsable : null
  }

  laboratoryItemCopy : any = {
    name : "",
    id : null,
    phone : "",
    address : "",
    responsable : null
  }


  currentLaboratory : any = null
  currentSelectedId : any = null
  laboratoryName = null

  modalRef? : BsModalRef
  modalEditRef? : BsModalRef
  modalDeleteRef? : BsModalRef
  modalDetailsRef? : BsModalRef

  constructor(
    private laboratoryService : LaboratoryService,
    private modalService : BsModalService,
    private toastService : ToastService,
    private responsableService : ResponsableService
  ) {
    this.getLaboratoriesFromService()
    this.getEnabledResponsables()
  }

  getEnabledResponsables(){
    this.responsables = this.responsableService.getEnabledResponsables()
  }

  ngOnInit(): void {
  }

  isItemValid(){
    return this.laboratoryItem.name != "" && this.laboratoryItem.address != "" && this.laboratoryItem.phone != "" 
  }

  getLaboratoriesFromService(){
    this.laboratories = this.laboratoryService.laboratories
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
    this.currentLaboratory = this.laboratories[index]
    this.laboratoryName = this.currentLaboratory.name
    console.log(this.currentLaboratory)
    let config = {
      backdrop: true,
      ignoreBackdropClick: true
    };
    this.modalEditRef = this.modalService.show(template,config)
  }

  openDeleteModal(template : TemplateRef<any>,id:number){
    this.currentSelectedId = id
    let index = this.getIndex(this.currentSelectedId)
    this.currentLaboratory = this.laboratories[index]
    this.laboratoryName = this.currentLaboratory.name
    let config = {
      backdrop: true,
      ignoreBackdropClick: true
    };
    this.modalDeleteRef = this.modalService.show(template)
  }

  openDetailsModal(template : TemplateRef<any>,id:number){
    this.currentSelectedId = id
    let index = this.getIndex(this.currentSelectedId)
    this.currentLaboratory = this.laboratories[index]
    this.laboratoryName = this.currentLaboratory.name
    let config = {
      backdrop: true,
      ignoreBackdropClick: true
    };
    this.modalDetailsRef = this.modalService.show(template)
  }

  addLaboratory(){
    if(this.selectedResponsableId == null){
      this.toastService.showDanger("Aucun responsable choisi pour ce laboiratoire","")
      return
    }
    if(this.isItemValid()){
      let responsable = this.getResponsableById(this.selectedResponsableId)
      
      this.laboratoryItem.responsable = responsable
      let laboId = this.laboratoryService.add(this.laboratoryItem)
      responsable.laboratoryId = laboId
      this.responsableService.updateLaboratoryId(responsable)
      this.getEnabledResponsables()
      this.laboratoryItem = this.laboratoryItemCopy
      this.laboratories = this.laboratoryService.laboratories
      this.selectedResponsableId = null
      this.toastService.showInfo("Laboratoire ajouté avec succès","")
      this.modalRef?.hide()
    }else{
      this.toastService.showDanger("Donnez toutes les information requises","")
    }
    
  }

  editLaboratory(){
    let index = this.getIndex(this.currentSelectedId)
    if(index != -1){
      if(this.selectedResponsableId != null){
        let oldResponsableLaboId = this.currentLaboratory.responsable.id
        if(this.selectedResponsableId != oldResponsableLaboId){
          this.currentLaboratory.responsable.laboratoryId = null
          this.responsableService.updateLaboratoryId(this.currentLaboratory.responsable)
        }
        let responsable = this.getResponsableById(this.selectedResponsableId)
        responsable.laboratoryId = this.currentLaboratory.id
        this.responsableService.updateLaboratoryId(responsable)
        this.currentLaboratory.responsable = responsable
        this.getEnabledResponsables()
      }
      this.laboratoryService.edit(this.currentLaboratory)
      this.laboratories = this.laboratoryService.laboratories
      this.toastService.showInfo("Modification effectuée avec succès","")
      this.modalEditRef?.hide()
      this.currentLaboratory = null
      this.currentSelectedId = null
      this.selectedResponsableId = null
    }else{
      this.toastService.showDanger("Aucun laboratoire trouvé pour la modification",'')
    }
  }

  
  deleteLaboratory(){
    let index = this.getIndex(this.currentSelectedId)
    if(index != -1){
      this.laboratoryService.delete(this.currentSelectedId)
      this.laboratories = this.laboratoryService.laboratories
      this.toastService.showInfo("Suppression effectuée avec succès","")
      this.modalDeleteRef?.hide()
      this.currentLaboratory = null
      this.currentSelectedId = null
      this.selectedResponsableId = null
    }else{
      this.toastService.showDanger("Aucun laboratoire trouvé pour la suppression",'')
    }
    
  }

  closeDetailsModal(){
    this.modalDetailsRef?.hide()
    this.currentLaboratory = null
    this.currentSelectedId = null
    this.selectedResponsableId = null
  }

  isSelected(responsable: any): boolean { 
    return this.currentLaboratory.responsable == responsable;
  }

  getIndex(id:number){
    for(let i=0;i< this.laboratories.length;i++){
      if(this.laboratories[i].id == id) return i
    }
    return -1
  }

  getResponsableById(id:number) : undefined | any{
    return this.responsables.find((responsable) => {
      return responsable.id == id
    })
  }
}
