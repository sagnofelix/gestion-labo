import { HttpClient } from '@angular/common/http';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AuthService } from 'src/app/services/auth/auth.service';
import { BudgetService } from 'src/app/services/budget/budget.service';
import { LaboratoryService } from 'src/app/services/laboratory/laboratory.service';
import { MemberService } from 'src/app/services/members/member.service';
import { ToastService } from 'src/app/services/toastr/toast.service';

@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.css']
})
export class BudgetComponent implements OnInit {

  budgets : any = []
  laboratories : any = []
  members : any = []
  selectedLaboratoryId = null
  selectedEmployeId = null

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

  isValid(item:any): boolean {
    return item.dotationBase != null && item.dotationRecherche != null && item.year != null
  }

  currentBudget : any = null
  currentSelectedIndex : any = null

  modalRef? : BsModalRef
  modalEditRef? : BsModalRef
  modalDeleteRef? : BsModalRef
  modalDetailsRef? : BsModalRef
  modalShareRef? : BsModalRef

  personnalBudgetValue : number = 0


  apiBaseUrl : string = "http://localhost:8083/"
  constructor(
    private budgetService : BudgetService,
    private laboratoryService : LaboratoryService,
    private modalService : BsModalService,
    private toastService : ToastService,
    private http: HttpClient,
    private memberService : MemberService,
    private authService : AuthService
  ) {
    this.getAllFromService()
  }

  ngOnInit(): void {
  }



  getAllFromService(){
    console.log(this.authService.user)
    this.laboratoryService.getAllFromApi().subscribe((laboratories) => {
      this.laboratoryService.laboratories = laboratories
      if(this.authService.user.type=="Responsable"){
        for(let i = 0; i < laboratories.length; i++) {
          let item : any = laboratories[i];
          if(item.laboratory.id == this.authService.user.laboratory.id) this.laboratories.push(item);
        }
      }else{
        this.laboratories = laboratories
      }

      this.budgetService.getAllFromApi().subscribe((budgets) => {
        if(this.authService.user.type=="Responsable"){
          for(let i = 0; i < budgets.length; i++) {
            let item : any = budgets[i];
            if(item.laboratory.id == this.authService.user.laboratory.id) this.budgets.push(item);
          }
        }else{
          this.budgets = budgets
        }
        this.budgetService.budgets = budgets
        this.memberService.getAllFromApi().subscribe((members) => {
          if(this.authService.user.type=="Responsable"){
            for(let i = 0; i < members.length; i++) {
              let item : any = members[i];
              if(item.laboratory.id == this.authService.user.laboratory.id) this.members.push(item);
            }
          }else{
            this.members = members
          }
          this.memberService.members = members
          console.log(this.members)
          this.loading = false
        })
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

  openShareModal(template : TemplateRef<any>,index:number){
    this.currentSelectedIndex = index
    this.currentBudget = this.budgets[index]
    console.log(this.currentBudget)

    this.personnalBudgetValue = 0
    let config = {
      backdrop: true,
      ignoreBackdropClick: true
    };
    this.modalShareRef = this.modalService.show(template,config)
  }

  openEditModal(template : TemplateRef<any>,index:number){
    this.currentSelectedIndex = index
    // let index = this.getCurrentBudgetIndex(this.currentSelectedIndex)
    this.currentBudget = this.budgets[index]
    //this.currentBudget.laboratory = this.getLboratoryForBudget(this.currentBudget.id)
    let config = {
      backdrop: true,
      ignoreBackdropClick: true
    };
    this.modalEditRef = this.modalService.show(template,config)
  }

  openDeleteModal(template : TemplateRef<any>,index:number){
    this.currentSelectedIndex = index
    // let index = this.getCurrentBudgetIndex(this.currentSelectedIndex)
    this.currentBudget = this.budgets[index]
    let config = {
      backdrop: true,
      ignoreBackdropClick: true
    };
    this.modalDeleteRef = this.modalService.show(template)
  }

  openDetailsModal(template : TemplateRef<any>,index:number){
    this.currentSelectedIndex = index
    this.currentBudget = this.budgets[index]
    let config = {
      backdrop: true,
      ignoreBackdropClick: true
    };
    this.modalDetailsRef = this.modalService.show(template)
  }

  add(){
    if(!this.isValid(this.budgetItem)){
      this.toastService.showDanger("Donner toutes les informations démandées","")
      return
    }
    if(this.selectedLaboratoryId == null){
      this.toastService.showDanger("Aucun laboratoire choisi pour ce budget","")
      return
    }
    this.http.post<any>(this.apiBaseUrl+'budgets/add/'+this.selectedLaboratoryId, this.budgetItem).subscribe(
      async (budgets:any) => {
        this.budgetItem = this.budgetItemCopy
        for(let i = 0; i < budgets.length; i++) {
          let item : any = budgets[i];
          if(item.laboratory.id == this.authService.user.laboratory.id) this.budgets.push(item);
        }
        console.log(budgets)
        this.budgetService.budgets = budgets
        this.selectedLaboratoryId = null
        this.toastService.showInfo("Budget ajouté avec succès","")
        this.modalRef?.hide()
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
            this.currentSelectedIndex = null
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

  share(){
    if(this.selectedEmployeId == null){
      this.toastService.showDanger("Aucun employé choisi","")
      return
    }
    if(this.personnalBudgetValue == 0){
      this.toastService.showDanger("La valeur à affecter est à 0","")
      return
    }

    if(this.personnalBudgetValue > this.currentBudget.budget.dotationRecherche){
      this.toastService.showDanger("La valeur de ce budget est déjà consommé en entier.","")
      return
    }

    this.http.get<any>(this.apiBaseUrl+'employes/affecte-budget/'+this.selectedEmployeId+"/"+this.currentBudget.budget.id+"/"+this.personnalBudgetValue).subscribe(
      async (data:any) => {
        if(data.hasError){
          this.toastService.showDanger(data.message,"")
          return
        }
        this.currentBudget.budget.dotationRecherche -= this.personnalBudgetValue
        this.budgets[this.currentSelectedIndex] = this.currentBudget
        this.selectedEmployeId = null
        this.personnalBudgetValue = 0
        this.toastService.showInfo("Affectation effectuée avec succès","")
        this.modalShareRef?.hide()
      },
      (error) => {
        console.log(error)
      }
    )

  }


  delete(){
    this.budgetService.delete(this.currentBudget.budget.id).subscribe((budgets:any) => {
      this.budgets = budgets
      this.budgetService.budgets = budgets
      this.toastService.showInfo("Suppression effectuée avec succès","")
      this.modalDeleteRef?.hide()
      this.currentBudget = null
      this.currentSelectedIndex = null
    },(err:any) => {console.log(err)})
  }

  closeDetailsModal(){
    this.modalDetailsRef?.hide()
    this.currentBudget = null
    this.currentSelectedIndex = null
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

  showResponsableLink() : boolean {
    return this.authService.user.type=="Administrateur"
  }
}
