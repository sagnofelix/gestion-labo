import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent implements OnInit {
  modalRef? : BsModalRef

  constructor(private modalService : BsModalService,) { }

  ngOnInit(): void {
  }

  openAddModal(template : TemplateRef<any>){
    let config = {
      backdrop: true,
      ignoreBackdropClick: true
    };
    this.modalRef = this.modalService.show(template,config)
  }

  connect(){}

}
