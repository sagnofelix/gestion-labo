import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BudgetService } from 'src/app/services/budget/budget.service';
import { LaboratoryService } from 'src/app/services/laboratory/laboratory.service';
import { ToastService } from 'src/app/services/toastr/toast.service';

@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.css']
})
export class BudgetComponent implements OnInit {

  budgets : any = []
  laboratories : any = []
  selectedLaboratoryId = null

  budgetItem : any = {
    id : null,
    db : null,
    dr: null,
    year : null,
    laboratory : null
  }

  budgetItemCopy : any = {
    id : null,
    db : null,
    dr: null,
    year : null,
    laboratory : null
  }

  currentBudget : any = null
  currentSelectedId : any = null

  modalRef? : BsModalRef
  modalEditRef? : BsModalRef
  modalDeleteRef? : BsModalRef
  modalDetailsRef? : BsModalRef



  constructor(
    private budgetService : BudgetService,
    private laborotyService : LaboratoryService,
    private modalService : BsModalService,
    private toastService : ToastService
  ) {
    this.getAllFromService()
    this.getLaboratories()
  }

  ngOnInit(): void {
  }

  getAllFromService(){
    this.budgets = this.budgetService.budgets
  }

  getLaboratories(){
    this.laboratories = this.laborotyService.laboratories
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
    this.currentBudget = this.budgets[index]
    let config = {
      backdrop: true,
      ignoreBackdropClick: true
    };
    this.modalEditRef = this.modalService.show(template,config)
  }

  openDeleteModal(template : TemplateRef<any>,id:number){
    this.currentSelectedId = id
    let index = this.getIndex(this.currentSelectedId)
    this.currentBudget = this.budgets[index]
    let config = {
      backdrop: true,
      ignoreBackdropClick: true
    };
    this.modalDeleteRef = this.modalService.show(template)
  }

  openDetailsModal(template : TemplateRef<any>,id:number){
    this.currentSelectedId = id
    let index = this.getIndex(this.currentSelectedId)
    this.currentBudget = this.budgets[index]
    let config = {
      backdrop: true,
      ignoreBackdropClick: true
    };
    this.modalDetailsRef = this.modalService.show(template)
  }

  add(){
    if(this.selectedLaboratoryId == null){
      this.toastService.showDanger("Aucun laboratoire choisi pour ce budget","")
      return
    }
    let laboratory = this.getLaboratoryById(this.selectedLaboratoryId)
    this.budgetItem.laboratory = laboratory
    console.log(this.budgetItem)
    this.budgetService.add(this.budgetItem)
    this.budgetItem = this.budgetItemCopy
    this.budgets = this.budgetService.budgets
    this.selectedLaboratoryId = null
    this.toastService.showInfo("Budget ajouté avec succès","")
    this.modalRef?.hide()
  }

  edit(){
    let index = this.getIndex(this.currentSelectedId)
    if(index != -1){
      if(this.selectedLaboratoryId != null){
        let oldlaboratoryLaboId = this.currentBudget.laboratory.id
        if(this.selectedLaboratoryId != oldlaboratoryLaboId){
          let laboratory = this.getLaboratoryById(this.selectedLaboratoryId)
          this.currentBudget.laboratory = laboratory
        }
      }
      let result = this.budgetService.edit(this.currentBudget)
      if(!result) return
      this.budgets = this.budgetService.budgets
      this.toastService.showInfo("Modification effectuée avec succès","")
      this.modalEditRef?.hide()
      this.currentBudget = null
      this.currentSelectedId = null
      this.selectedLaboratoryId = null
    }else{
      this.toastService.showDanger("Aucun budget trouvé pour la modification","")
    }
  }

  
  delete(){
    let result = this.budgetService.delete(this.currentSelectedId)
    if(!result) return
    this.budgets = this.budgetService.budgets
    this.toastService.showInfo("Suppression effectuée avec succès","")
    this.modalDeleteRef?.hide()
    this.currentBudget = null
    this.currentSelectedId = null
  }

  closeDetailsModal(){
    this.modalDetailsRef?.hide()
    this.currentBudget = null
    this.currentSelectedId = null
  }

  getIndex(id:number){
    for(let i=0;i< this.laboratories.length;i++){
      if(this.laboratories[i].id == id) return i
    }
    return -1
  }

  getLaboratoryById(id:number) : undefined | any{
    return this.laboratories.find((laboratory:any) => {
      return laboratory.id == id
    })
  }


}
