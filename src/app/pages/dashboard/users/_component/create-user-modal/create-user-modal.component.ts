import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-create-user-modal',
  templateUrl: './create-user-modal.component.html',
  styleUrls: ['./create-user-modal.component.scss']
})
export class CreateUserModalComponent implements OnInit {

  user = {
    username: null,
    email: null
  }

  modalRef : NzModalRef | null = null;
  form = new FormGroup({
    username: new FormControl(null,[Validators.required]),
    email: new FormControl(null,[Validators.required, Validators.email])
  });


  constructor() { }

  ngOnInit(): void {
    this.form.valueChanges.subscribe(e => {
      this.modalRef!.updateConfig({
        nzOkDisabled: !this.form.valid
      });
    })
  }

}
