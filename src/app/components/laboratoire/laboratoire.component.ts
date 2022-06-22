import { HttpClient } from '@angular/common/http';
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
  currentSelectedIndex : any = null
  laboratoryName = null

  modalRef? : BsModalRef
  modalEditRef? : BsModalRef
  modalDeleteRef? : BsModalRef
  modalDetailsRef? : BsModalRef

  apiBaseUrl : string = "http://localhost:8083/"
  loading = true
  waiting = false


  constructor(
    private laboratoryService : LaboratoryService,
    private modalService : BsModalService,
    private toastService : ToastService,
    private responsableService : ResponsableService,
    private http: HttpClient
  ) {
  }



  async ngOnInit(): Promise<void> {
    await this.getLaboratoriesFromService()
  }

  isItemValid(item:any){
    return item.name != "" && item.address != "" && item.phone != ""
  }

  getLaboratoriesFromService(){
    this.laboratoryService.getAllFromApi().subscribe((laboratories) => {
      this.laboratories = laboratories
      console.log(this.laboratories)
      this.responsableService.getEnabledFromApi().subscribe((responsables) => {
        this.responsables = responsables
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

  openEditModal(template : TemplateRef<any>,index:number){
    this.currentSelectedIndex = index
    this.currentLaboratory = this.laboratories[index]
    this.laboratoryName = this.currentLaboratory.laboratory.name
    let config = {
      backdrop: true,
      ignoreBackdropClick: true
    };
    this.modalEditRef = this.modalService.show(template,config)
  }

  openDeleteModal(template : TemplateRef<any>,index:number){
    this.currentSelectedIndex = index
    this.currentLaboratory = this.laboratories[index]
    this.laboratoryName = this.currentLaboratory.laboratory.name
    let config = {
      backdrop: true,
      ignoreBackdropClick: true
    };
    this.modalDeleteRef = this.modalService.show(template)
  }

  openDetailsModal(template : TemplateRef<any>,index:number){
    this.currentSelectedIndex = index;
    this.currentLaboratory = this.laboratories[index]
    this.laboratoryName = this.currentLaboratory.laboratory.name
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
    if(this.isItemValid(this.laboratoryItem)){
      this.waiting = true
      this.http.post<any[]>(this.apiBaseUrl+'laboratories/add/'+this.selectedResponsableId, this.laboratoryItem).subscribe(
        async (laboratories:any) => {
          this.responsableService.getEnabledFromApi().subscribe((responsables) => {
            this.responsables = responsables
            this.laboratoryService.laboratories = laboratories
            this.laboratories = laboratories
            this.laboratoryItem = {
              name : "",
              id : null,
              phone : "",
              address : "",
              responsable : null
            }
            this.selectedResponsableId = null
            this.waiting = false
            this.toastService.showInfo("Laboratoire ajouté avec succès","")
            this.modalRef?.hide()
          })
        },
        (error) => {
          this.waiting = false
          console.log(error)
        }
      )
    }else{
      this.toastService.showDanger("Donnez toutes les information requises","")
    }
  }

  editLaboratory(){
    if(this.isItemValid(this.currentLaboratory.laboratory)){
      this.http.post<any[]>(this.apiBaseUrl+'laboratories/edit', this.currentLaboratory.laboratory).subscribe(
        async (laboratories:any) => {
          console.log(laboratories);
          this.laboratoryService.laboratories = laboratories
          this.laboratories = this.laboratoryService.laboratories
          this.toastService.showInfo("Modification effectuée avec succès","")
          this.modalEditRef?.hide()
          this.currentLaboratory = null
          this.currentSelectedIndex = null
          this.selectedResponsableId = null
        },
        (error) => {
          console.log(error)
        }
      )
    }else{
      this.toastService.showDanger("Donnez toutes les information requises","")
    }
  }

  deleteLaboratory(){
    this.laboratoryService.delete(this.currentLaboratory.laboratory.id).subscribe((laboratories) => {
      this.laboratories = laboratories
      this.laboratoryService.laboratories = laboratories
      this.responsableService.getEnabledFromApi().subscribe((data) => {
        this.responsables = data
        this.toastService.showInfo("Suppression effectuée avec succès","")
        this.modalDeleteRef?.hide()
        this.currentLaboratory = null
        this.currentSelectedIndex = null
      })
    },(err) => {console.log(err)})

  }

  closeDetailsModal(){
    this.modalDetailsRef?.hide()
    this.currentLaboratory = null
    this.currentSelectedIndex = null
    this.selectedResponsableId = null
  }
}
