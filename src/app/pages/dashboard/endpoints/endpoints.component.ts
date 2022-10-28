import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { firstValueFrom } from 'rxjs';
import { EndpointsService } from 'src/app/core/services/endpoints.service';
import { EditEndpointComponent } from './_components/edit-endpoint/edit-endpoint.component';

@Component({
  selector: 'app-endpoints',
  templateUrl: './endpoints.component.html',
  styleUrls: ['./endpoints.component.scss']
})
export class EndpointsComponent implements OnInit {
  endpoints: any = [];
  constructor(private endpointsService: EndpointsService,
    private notificationService: NzNotificationService,
    private modalService: NzModalService) { }

  async ngOnInit() {
    this.getEndpoints();
  }

  async getEndpoints() {
    this.endpoints = await firstValueFrom(this.endpointsService.list());
    console.log(this.endpoints);
  }

  editEndpoint(endpoint: any) {

  }

  openEndpointModal() {
    const modalRef = this.modalService.create({
      nzContent: EditEndpointComponent,
      nzMaskClosable: false,
      nzTitle: "Create new Endpoint",
      nzWidth: "50vw",
      nzOkDisabled : true,
      nzOnOk: async (component: EditEndpointComponent) => {
        let endpoint = component.endpoint;
        if (endpoint.protocol == 'http') {
          let port = endpoint.url.split(':')[1]
          endpoint.port = parseInt(port);
          if (endpoint.tls) {
            endpoint.url = endpoint.url.split(':')[0];
          } else {
            endpoint.url = `http://` + endpoint.url.split(':')[0];
          }
        }
        const form_data = new FormData();
        for (var key in endpoint) {
          //@ts-ignore
          form_data.append(key, (endpoint[key] as string));
        }
        return await firstValueFrom(this.endpointsService.create(form_data)).then(res => {
          this.notificationService.success('Success', "New endpoint created successfully");
          this.getEndpoints();
          return true;
        }).catch(err => { this.notificationService.error('Error', err.error.message); return false });
      }
    })

    modalRef.componentInstance!.modalRef = modalRef;
  }


  async deleteEndpoint(endpoint: any) {
    firstValueFrom(this.endpointsService.delete(endpoint.id)).then(res => {
      this.notificationService.success('Success', "Endpoint deleted successfully");
      this.getEndpoints()
    }).catch(err => {
      this.notificationService.error('Error', "An error has occurred")
    })
  }
}
