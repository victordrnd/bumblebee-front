import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { firstValueFrom } from 'rxjs';
import { UsersService } from 'src/app/core/services/users.service';
import { CreateUserModalComponent } from './_component/create-user-modal/create-user-modal.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  users: any = [];
  constructor(private usersService: UsersService,
    private notification: NzNotificationService,
    private modalService: NzModalService) { }

  ngOnInit() {
    this.getUsers();
    console.log(this.users);
  }


  async getUsers() {
    this.users = await firstValueFrom(this.usersService.getAllUsers());

  }
  createUserModal() {
    const modalRef = this.modalService.create({
      nzContent: CreateUserModalComponent,
      nzTitle: "Create new user",
      nzWidth: '50vw',
      nzOkDisabled: true,
      nzOnOk: async (component) => {
        return await firstValueFrom(this.usersService.createUser(component.form.value)).then(res => {
          this.notification.success('Success', "User has been created");
          this.getUsers();
        }).catch(e => {
          this.notification.error('Error', e.message);
          return false;
        })
      }
    })
    modalRef.componentInstance!.modalRef = modalRef;
  }


  async switchUserEnable(evt: boolean, user: any) {
    if (evt) {
      await firstValueFrom(this.usersService.enable(user.Username))
    } else {
      await firstValueFrom(this.usersService.disable(user.Username))
    }
    this.getUsers();
  }


  async deleteUser(user : any){
    await firstValueFrom(this.usersService.delete(user.Username)).then(res => {
      this.notification.success('Success', "User has been deleted successfully");
      this.getUsers();
    }).catch(e => {
      this.notification.error('Error', e.message);
    })
  }
}
