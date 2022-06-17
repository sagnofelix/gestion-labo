import { HttpClient } from '@angular/common/http';
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

  loading = true

  budgetItem : any = {
    id : null,
    db : null,
    dr: null,
    year : null,
    laboratory : null
  }

  budgetItemCopy : any = {
    id : null,
    dotationBase : null,
    dotationRecherche: null,
    year : null,
    laboratory : null
  }

  currentBudget : any = null
  currentSelectedId : any = null

  modalRef? : BsModalRef
  modalEditRef? : BsModalRef
  modalDeleteRef? : BsModalRef
  modalDetailsRef? : BsModalRef


  apiBaseUrl : string = "http://localhost:8083/"
  constructor(
    private budgetService : BudgetService,
    private laboratoryService : LaboratoryService,
    private modalService : BsModalService,
    private toastService : ToastService,
    private http: HttpClient
  ) {
    this.getAllFromService()
  }

  ngOnInit(): void {
  }

  getAllFromService(){
    this.laboratoryService.getAllFromApi().subscribe((laboratories) => {
      this.laboratoryService.laboratories = laboratories
      this.laboratories = laboratories
      this.budgetService.getAllFromApi().subscribe((budgets) => {
        this.budgets = budgets
        this.budgetService.budgets = budgets
        console.log(budgets)
        this.loading = false
      })
    },(err) => {console.log(err)})
  }

  getLaboratories(){
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
    let index = this.getCurrentBudgetIndex(this.currentSelectedId)
    this.currentBudget = this.budgets[index]
    this.currentBudget.laboratory = this.getLboratoryForBudget(this.currentBudget.id)
    let config = {
      backdrop: true,
      ignoreBackdropClick: true
    };
    this.modalEditRef = this.modalService.show(template,config)
  }

  openDeleteModal(template : TemplateRef<any>,id:number){
    this.currentSelectedId = id
    let index = this.getCurrentBudgetIndex(this.currentSelectedId)
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
    this.http.post<any>(this.apiBaseUrl+'budgets/add?laboId='+this.selectedLaboratoryId, this.budgetItem).subscribe(
      async (budget:any) => {
        if(budget.id == 0){
          this.toastService.showDanger("Une erreur est survenu lors de l'enregistrement","")
        }else{
          this.budgetService.add(budget)
          this.budgetItem = this.budgetItemCopy
          this.budgets = this.budgetService.budgets
          this.selectedLaboratoryId = null
          this.toastService.showInfo("Budget ajouté avec succès","")
          this.modalRef?.hide()
        }
      },
      (error) => {
        console.log(error)
      }
    )
  }

  edit(){
    let index = this.getCurrentBudgetIndex(this.currentBudget.id)
    if(index != -1){
      this.http.post<any>(this.apiBaseUrl+'budgets/edit?laboId='+this.currentBudget.laboratory.id, this.currentBudget).subscribe(
        async (budget:any) => {
          if(budget.id == 0){
            this.toastService.showDanger("Une erreur est survenu lors de la modification","")
          }else{
            let result = this.budgetService.edit(budget)
            if(!result) return
            this.budgets = this.budgetService.budgets
            this.toastService.showInfo("Modification effectuée avec succès","")
            this.modalEditRef?.hide()
            this.currentBudget = null
            this.currentSelectedId = null
            this.selectedLaboratoryId = null
          }
        },
        (error) => {
          console.log(error)
        }
      )
    }else{
      this.toastService.showDanger("Aucun budget trouvé pour la modification","")
    }
  }


  delete(){
    // let result = this.budgetService.delete(this.currentSelectedId)
    // if(!result) return
    // this.budgets = this.budgetService.budgets
    // this.toastService.showInfo("Suppression effectuée avec succès","")
    // this.modalDeleteRef?.hide()
    // this.currentBudget = null
    // this.currentSelectedId = null

    this.budgetService.delete(this.currentSelectedId).subscribe((budgets:any) => {
      this.budgets = budgets
      this.budgetService.budgets = budgets
      this.toastService.showInfo("Suppression effectuée avec succès","")
      this.modalDeleteRef?.hide()
      this.currentBudget = null
      this.currentSelectedId = null
    },(err:any) => {console.log(err)})
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

  getCurrentBudgetIndex(id:number){
    console.log(this.budgets)
    console.log(id)
    for(let i=0;i< this.budgets.length;i++){
      if(this.budgets[i].id == id) return i
    }
    return -1
  }

  getLaboratoryById(id:number) : undefined | any{
    return this.laboratories.find((laboratory:any) => {
      return laboratory.id == id
    })
  }

  getLboratoryForBudget(budget_id:number){
    for(let i=0;i< this.laboratories.length;i++){
      let labo = this.laboratories[i]
      for(let j=0;j< labo.budgets.length;j++){
        let budget = labo.budgets[j]
        if(budget_id == budget.id) return labo
      }
    }
    return null
  }


}
