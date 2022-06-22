import { HttpClient } from '@angular/common/http';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NeedService } from 'src/app/services/need/need.service';
import { LaboratoryService } from 'src/app/services/laboratory/laboratory.service';
import { MemberService } from 'src/app/services/members/member.service';
import { ToastService } from 'src/app/services/toastr/toast.service';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-need',
  templateUrl: './need.component.html',
  styleUrls: ['./need.component.css']
})
export class NeedComponent implements OnInit {

  needs : any = []
  personnalbudgets : any = []
  members : any = []
  selectedBudgetId = null
  selectedEmployeId = null

  option = 0  //0 information , 1 list , 2 add,

  loading = true

  needItem : any = {
    id : null,
    description : null,
    amount: null,
  }

  passwordInfo : any = {
    old : null,
    new : null,
    confirm : null
  }

  user :any = null

  needItemCopy : any = {
    id : null,
    description : null,
    amount: null,
  }

  isValid(item:any): boolean {
    return item.description != null && item.amount != null
  }

  currentNeed : any = null
  currentSelectedId : any = null

  modalRef? : BsModalRef
  modalEditRef? : BsModalRef
  modalDeleteRef? : BsModalRef
  modalDetailsRef? : BsModalRef
  modalChangePasswordRef? : BsModalRef


  apiBaseUrl : string = "http://localhost:8083/"
  constructor(
    private needService : NeedService,
    private laboratoryService : LaboratoryService,
    private modalService : BsModalService,
    private toastService : ToastService,
    private http: HttpClient,
    private authService:AuthService,
    private memberService : MemberService,
  ) {
    this.getAllFromService()
  }

  ngOnInit(): void {
  }


  getAllFromService(){
    this.memberService.getOneFromApi(this.authService.user.user.id).subscribe((data:any) => {
      console.log(data)
      this.authService.user = data
      this.user = this.authService.user
      this.needs = data.needs
      this.personnalbudgets =  data.user.employeBudgets
      console.log(this.personnalbudgets)
      this.memberService.getAllFromApi().subscribe((members:any) => {
        console.log(members)
        this.loading = false
      })

    },(err) => {console.log(err)})
  }


  openAddModal(template : TemplateRef<any>){
    let config = {
      backdrop: true,
      ignoreBackdropClick: true
    };
    this.modalRef = this.modalService.show(template,config)
  }

  openChangePasswordModal(template : TemplateRef<any>){
    let config = {
      backdrop: true,
      ignoreBackdropClick: true
    };
    this.modalChangePasswordRef = this.modalService.show(template,config)
  }

  openEditModal(template : TemplateRef<any>,index:number){
    this.currentSelectedId = index
    this.currentNeed = this.needs[index]
    let config = {
      backdrop: true,
      ignoreBackdropClick: true
    };
    this.modalEditRef = this.modalService.show(template,config)
  }

  openDeleteModal(template : TemplateRef<any>,index:number){
    this.currentSelectedId = index
    this.currentNeed = this.needs[index]

    let config = {
      backdrop: true,
      ignoreBackdropClick: true
    };
    this.modalDeleteRef = this.modalService.show(template)
  }

  openDetailsModal(template : TemplateRef<any>,index:number){
    this.currentSelectedId = index
    this.currentNeed = this.needs[index]
    let config = {
      backdrop: true,
      ignoreBackdropClick: true
    };
    this.modalDetailsRef = this.modalService.show(template)
  }

  changeOption(option : number){
    this.option = option
  }


  add(){
    if(!this.isValid(this.needItem)){
      this.toastService.showDanger("Donner toutes les informations démandées","")
      return
    }
    if(this.selectedBudgetId == null){
      this.toastService.showDanger("Aucun budget choisi pour ce pour besoin","")
      return
    }

    this.http.post<any>(this.apiBaseUrl+'needs-add/'+this.authService.user.user.id+"/"+this.selectedBudgetId, this.needItem).subscribe(
      async (data:any) => {
        if(data.hasError){
          this.toastService.showDanger(data.message,"")
          return
        }
        this.needItem = {
          id : null,
          description : null,
          amount: null,
        }

        this.memberService.getOneFromApi(this.authService.user.user.id).subscribe((data:any) => {
          this.authService.user = data
          this.user = this.authService.user
          this.needs = data.needs
          this.personnalbudgets =  data.user.employeBudgets

          this.selectedBudgetId = null
          this.option = 1
          this.toastService.showInfo("Besoin ajouté avec succès","")
          this.modalRef?.hide()
        },(err) => {console.log(err)})
      },
      (error) => {
        console.log(error)
      }
    )
  }

  edit(){
    let index = this.getCurrentNeedIndex(this.currentNeed.id)
    if(index != -1){
      this.http.post<any>(this.apiBaseUrl+'budgets/edit?laboId='+this.currentNeed.laboratory.id, this.currentNeed).subscribe(
        async (budget:any) => {
          if(budget.id == 0){
            this.toastService.showDanger("Une erreur est survenu lors de la modification","")
          }else{
            //this.needs = this.budgetService.budgets
            this.toastService.showInfo("Modification effectuée avec succès","")
            this.modalEditRef?.hide()
            this.currentNeed = null
            this.currentSelectedId = null
            this.selectedBudgetId = null
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

  validPassword(){
    return this.passwordInfo.old != null && this.passwordInfo.new != null && this.passwordInfo.confirm != null
  }

  changePassword(){
    if(!this.validPassword()){
      this.toastService.showDanger("Donner toutes les informations démandées","")
      return
    }
    if(this.authService.user.user.password != this.passwordInfo.old){
      this.toastService.showDanger("Ancien mot de password incorrecte","")
      return
    }
    if(this.passwordInfo.new != this.passwordInfo.confirm){
      this.toastService.showDanger("Le nouveau mot de passe et celui de la confirmation sont différents","")
      return
    }
    if(this.authService.user.user.password == this.passwordInfo.new){
      this.toastService.showDanger("Utiliser un mot de passe différent de l'ancien","")
      return
    }
    this.memberService.changePassword(this.authService.user.user.id,this.passwordInfo.new).subscribe((data:any) => {
      if(data.hasError){
        this.toastService.showDanger(data.message,"")
        return
      }
      this.authService.user.user.password = this.passwordInfo.new
      this.toastService.showInfo("Mot de passe changé avec succès","")
      this.modalChangePasswordRef?.hide()
      this.passwordInfo  = {
        old : null,
        new : null,
        confirm : null
      }
    },(err:any) => {console.log(err)})
  }


  delete(){
    this.needService.delete(this.currentNeed.id).subscribe((needs:any) => {
      this.needs = needs
      this.authService.user.needs = needs
      this.toastService.showInfo("Suppression effectuée avec succès","")
      this.modalDeleteRef?.hide()
      this.currentNeed = null
      this.currentSelectedId = null
    },(err:any) => {console.log(err)})
  }

  closeDetailsModal(){
    this.modalDetailsRef?.hide()
    this.currentNeed = null
    this.currentSelectedId = null
  }

  getIndex(id:number){
    for(let i=0;i< this.needs.length;i++){
      if(this.needs[i].id == id) return i
    }
    return -1
  }

  getCurrentNeedIndex(id:number){
    for(let i=0;i< this.needs.length;i++){
      if(this.needs[i].id == id) return i
    }
    return -1
  }

  getBudgetValue(db :number, dr:number){
    return db+dr
  }
}
