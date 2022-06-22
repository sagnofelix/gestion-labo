import { HttpClient } from '@angular/common/http';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ResponsableService } from 'src/app/services/responsable/responsable.service';
import { ToastService } from 'src/app/services/toastr/toast.service';

@Component({
  selector: 'app-responsable',
  templateUrl: './responsable.component.html',
  styleUrls: ['./responsable.component.css']
})
export class ResponsableComponent implements OnInit {

  responsables : any = []
  loading = true
  waiting = false

  responsableItem : any = {
    name : null,
    id : null,
    firstname : null,
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
  currentSelectedIndex : any = null
  fullname : any = null

  modalRef? : BsModalRef
  modalEditRef? : BsModalRef
  modalDeleteRef? : BsModalRef
  modalDetailsRef? : BsModalRef

  apiBaseUrl : string = "http://localhost:8083/"

  constructor(
    private responsableService : ResponsableService,
    private modalService : BsModalService,
    private toastService : ToastService,
    private http: HttpClient,
    private authService : AuthService
  ) {
    this.getAllFromService()
  }

  ngOnInit(): void {
  }

  getAllFromService(){
    this.responsableService.getAllFromApi().subscribe((responsables) => {
      console.log(responsables)
      this.responsables = responsables
      this.responsableService.responsables = responsables
      this.loading = false
    },(err) => {console.log(err)})
  }

  openAddModal(template : TemplateRef<any>){
    this.responsableItem = {
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
    this.currentResponsable = this.responsables[index]
    this.fullname = this.currentResponsable.responsable.name + " " + this.currentResponsable.responsable.firstname
    console.log(this.currentResponsable)
    let config = {
      backdrop: true,
      ignoreBackdropClick: true
    };
    this.modalEditRef = this.modalService.show(template,config)
  }

  openDeleteModal(template : TemplateRef<any>,index:number){
    this.currentSelectedIndex = index
    this.currentResponsable = this.responsables[index]
    console.log(this.currentResponsable)
    let config = {
      backdrop: true,
      ignoreBackdropClick: true
    };
    this.modalDeleteRef = this.modalService.show(template)
  }

  openDetailsModal(template : TemplateRef<any>,index:number){
    this.currentSelectedIndex = index
    this.currentResponsable = this.responsables[index]
    console.log(this.currentResponsable)
    this.fullname = this.currentResponsable.responsable.name + " " + this.currentResponsable.responsable.firstname
    console.log(this.fullname)
    let config = {
      backdrop: true,
      ignoreBackdropClick: true
    };
    this.modalDetailsRef = this.modalService.show(template)
  }

  add(){
    this.waiting = true
    if(this.vallidateInputs(this.responsableItem)){
      this.waiting = true
      this.http.post<any[]>(this.apiBaseUrl+'responsables/add', this.responsableItem).subscribe(
        (data:any) => {
          console.log(data)
          data.type = "Responsable"

          if(data.length == 1 && data[0].hasError){
            this.toastService.showDanger(data[0].message,"")
            this.waiting = false
            return
          }
          this.responsableService.responsables = data
          this.responsableItem = this.responsableItemCopy
          this.responsables = this.responsableService.responsables
          this.waiting = false
          this.toastService.showInfo("Responsable ajouté avec succès","")
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
    let result = this.responsableService.edit(this.currentResponsable)
    if(!result) return
    this.responsables = this.responsableService.responsables
    this.toastService.showInfo("Modification effectuée avec succès","")
    this.modalEditRef?.hide()
    this.currentResponsable = null
    this.currentSelectedIndex = null
  }


  delete(){
    this.responsableService.delete(this.currentResponsable.responsable.id).subscribe((responsables) => {
      this.responsables = responsables
      this.responsableService.responsables = responsables
      this.toastService.showInfo("Suppression effectuée avec succès","")
      this.modalDeleteRef?.hide()
      this.currentResponsable = null
      this.currentSelectedIndex = null
    },(err) => {console.log(err)})

  }

  closeDetailsModal(){
    this.modalDetailsRef?.hide()
    this.currentResponsable = null
    this.currentSelectedIndex = null
  }

  vallidateInputs(item :any){
    return item.email != null && item.phone != null && item.password != null && item.name != null && item.firstname != null
  }

  showResponsableLink() : boolean {
    return this.authService.user.type=="Administrateur"
  }
}
