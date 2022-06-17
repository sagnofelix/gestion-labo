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
  currentSelectedId : any = null
  laboratoryName = null

  modalRef? : BsModalRef
  modalEditRef? : BsModalRef
  modalDeleteRef? : BsModalRef
  modalDetailsRef? : BsModalRef

  apiBaseUrl : string = "http://localhost:8083/"
  loading = true

  constructor(
    private laboratoryService : LaboratoryService,
    private modalService : BsModalService,
    private toastService : ToastService,
    private responsableService : ResponsableService,
    private http: HttpClient
  ) {
    this.getEnabledResponsables()
  }

  getEnabledResponsables(){
    this.responsables = this.responsableService.getEnabledResponsables()
    console.log("enabled 1",this.responsables)

  }

  async ngOnInit(): Promise<void> {
    await this.getLaboratoriesFromService()
  }

  isItemValid(){
    return this.laboratoryItem.name != "" && this.laboratoryItem.address != "" && this.laboratoryItem.phone != ""
  }

  getLaboratoriesFromService(){
    this.laboratoryService.getAllFromApi().subscribe((laboratories) => {
      this.laboratories = laboratories
      console.log(this.laboratories)
      this.responsableService.getEnabledFromApi().subscribe((data) => {
        this.responsables = data
        console.log(this.responsables)
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
      this.http.post<any>(this.apiBaseUrl+'laboratories/add?responsable_id='+this.selectedResponsableId, this.laboratoryItem).subscribe(
        async (laboratory:any) => {
          console.log(laboratory);
          if(laboratory.id == 0){
            this.toastService.showDanger(laboratory.name,"")
          }else{
            this.laboratoryService.add(laboratory)
            this.responsableService.getEnabledFromApi().subscribe((responsables) => {
              this.responsables = responsables
              this.laboratories = this.laboratoryService.laboratories
              this.laboratoryItem = this.laboratoryItemCopy
              this.selectedResponsableId = null
              this.toastService.showInfo("Responsable ajouté avec succès","")
              this.modalRef?.hide()
            })
          }
        },
        (error) => {
          console.log(error)
        }
      )
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
    this.laboratoryService.delete(this.currentSelectedId).subscribe((laboratories) => {
      this.laboratories = laboratories
      this.laboratoryService.laboratories = laboratories
      this.responsableService.getEnabledFromApi().subscribe((data) => {
        this.responsables = data

        this.toastService.showInfo("Suppression effectuée avec succès","")
        this.modalDeleteRef?.hide()
        this.currentLaboratory = null
        this.currentSelectedId = null
      })
    },(err) => {console.log(err)})

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

  getLResponsableForLabo(budget_id:number){
    for(let i=0;i< this.responsables.length;i++){
      let responsable = this.responsables[i]
      // for(let j=0;j< labo.budgets.length;j++){
      //   let budget = labo.budgets[j]
      //   if(budget_id == budget.id) return labo
      // }
    }
    return null
  }
}
