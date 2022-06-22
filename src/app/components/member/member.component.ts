import { HttpClient } from '@angular/common/http';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AuthService } from 'src/app/services/auth/auth.service';
import { LaboratoryService } from 'src/app/services/laboratory/laboratory.service';
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

  selectedLaboratoryId = null
  laboratories : any = []

  currentMember : any = null
  currentSelectedIndex : any = null
  fullname : any = null


  modalRef? : BsModalRef
  modalEditRef? : BsModalRef
  modalDeleteRef? : BsModalRef
  modalDetailsRef? : BsModalRef

  apiBaseUrl : string = "http://localhost:8083/"
  loading = true
  waiting = false


  constructor(
    private memberService : MemberService,
    private modalService : BsModalService,
    private toastService : ToastService,
    private http: HttpClient,
    private laboratoryService : LaboratoryService,
    private authService : AuthService
  ) {
    this.getAllFromService()
  }

  ngOnInit(): void {
  }

  getAllFromService(){
    this.laboratoryService.getAllFromApi().subscribe((laboratories) => {
      this.laboratoryService.laboratories = laboratories
      this.laboratories = laboratories
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
        this.loading = false
      },(err) => {console.log(err)})
    },(err) => {console.log(err)})
  }

  openAddModal(template : TemplateRef<any>){
    this.memberItem = {
      name : null,
      id : null,
      firstname : null,
      email : null,
      phone:null,
      laboratoryId : null,
    }
    let config = {
      backdrop: true,
      ignoreBackdropClick: true
    };
    this.modalRef = this.modalService.show(template,config)
  }

  openEditModal(template : TemplateRef<any>,index:number){
    this.currentSelectedIndex = index
    this.currentMember = this.members[index]
    this.fullname = this.currentMember.employe.name + " " + this.currentMember.employe.firstname
    console.log(this.currentMember)
    let config = {
      backdrop: true,
      ignoreBackdropClick: true
    };
    this.modalEditRef = this.modalService.show(template,config)
  }

  openDeleteModal(template : TemplateRef<any>,index:number){
    this.currentSelectedIndex = index
    this.currentMember = this.members[index]
    let config = {
      backdrop: true,
      ignoreBackdropClick: true
    };
    this.modalDeleteRef = this.modalService.show(template)
  }

  openDetailsModal(template : TemplateRef<any>,index:number){
    this.currentSelectedIndex = index
    this.currentMember = this.members[index]
    console.log(this.currentMember)
    this.fullname = this.currentMember.employe.name + " " + this.currentMember.employe.firstname
    console.log(this.fullname)
    let config = {
      backdrop: true,
      ignoreBackdropClick: true
    };
    this.modalDetailsRef = this.modalService.show(template)
  }

  add(){
    this.waiting = true
    if(this.vallidateInputs(this.memberItem)){
      this.waiting = true
      this.http.post<any[]>(this.apiBaseUrl+'employes/add/'+this.selectedLaboratoryId, this.memberItem).subscribe(
        (members:any) => {
            if(members.length == 1 && members[0].hasError){
              this.toastService.showDanger(members[0].message,"")
              this.waiting = false
              return
            }
            this.memberService.members = members
            this.memberItem = this.memberItemCopy
            if(this.authService.user.type=="Responsable"){
              for(let i = 0; i < members.length; i++) {
                let item : any = members[i];
                if(item.laboratory.id == this.authService.user.laboratory.id) this.members.push(item);
              }
            }else{
              this.members = members
            }
            this.selectedLaboratoryId = null
            this.waiting = false
            this.toastService.showInfo("Employé ajouté avec succès","")
            this.modalRef?.hide()
        },
        (error) => {
          this.waiting = false
          console.log(error)
        }
      )
    }else{
      this.toastService.showDanger("Donnez toutes les informations recquises.",'')
    }
  }

  edit(){
    let result = this.memberService.edit(this.currentMember)
    if(!result) return
    this.members = this.memberService.members
    this.toastService.showInfo("Modification effectuée avec succès","")
    this.modalEditRef?.hide()
    this.currentMember = null
    this.currentSelectedIndex = null
  }


  delete(){
    if(this.currentMember != null){
      this.memberService.delete(this.currentMember.employe.id).subscribe((members) => {
        console.log(this.currentMember.employe.id)
        this.members = members
        this.memberService.members = members
        this.currentMember = null
        this.currentSelectedIndex = null
        this.toastService.showInfo("Suppression effectuée avec succès","")
        this.modalDeleteRef?.hide()

      },(err) => {console.log(err)})
    }


  }

  closeDetailsModal(){
    this.modalDetailsRef?.hide()
    this.currentMember = null
    this.currentSelectedIndex = null
  }

  vallidateInputs(item :any){
    return item.email != null && item.phone != null && item.password != null && item.name != null && item.firstname != null
  }

  showResponsableLink() : boolean {
    return this.authService.user.type=="Administrateur"
  }
}
