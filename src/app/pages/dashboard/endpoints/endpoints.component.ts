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


  openEndpointModal() {
    const modalRef = this.modalService.create({
      nzContent: EditEndpointComponent,
      nzMaskClosable: false,
      nzTitle: "Create new Endpoint",
      nzWidth: "50vw",
      nzOkDisabled: true,
      nzOnOk: async (component: EditEndpointComponent) => {
       const form_data = this.buildFormData(component.endpoint);
        return await firstValueFrom(this.endpointsService.create(form_data)).then(res => {
          this.notificationService.success('Success', "New endpoint created successfully");
          this.getEndpoints();
          return true;
        }).catch(err => { this.notificationService.error('Error', err.error.message); return false });
      }
    })

    modalRef.componentInstance!.modalRef = modalRef;
  }


  editEndpoint(endpoint: any) {
    const modalRef = this.modalService.create({
      nzContent: EditEndpointComponent,
      nzMaskClosable: false,
      nzTitle: `Edit Endpoint ${endpoint.name}`,
      nzWidth: "50vw",
      nzOkDisabled: true,
      nzComponentParams: { endpoint: { ...endpoint } },
      nzOnOk: async (component: EditEndpointComponent) => {
        const form_data = this.buildFormData(component.endpoint);
        return await firstValueFrom(this.endpointsService.update(form_data)).then(res => {
          this.notificationService.success('Success', "Endpoint successfully updated");
          this.getEndpoints();
          return true;
        }).catch(err => { this.notificationService.error('Error', err.error.message); return false });
      }
    });
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

  private buildFormData(endpoint: any) {
    // let endpoint = component.endpoint;
    if (endpoint.protocol == 'http') {
      const uri = new URL("http://" + endpoint.url);
      let port = uri.port
      endpoint.port = parseInt(port);
      if (endpoint.tls) {
        endpoint.url = "https://" + uri.hostname;
      } else {
        endpoint.url = `http://` + uri.hostname;
      }
    }
    const form_data = new FormData();
    for (var key in endpoint) {
      //@ts-ignore
      form_data.append(key, (endpoint[key] as string));
    }

    return form_data
  }
}
