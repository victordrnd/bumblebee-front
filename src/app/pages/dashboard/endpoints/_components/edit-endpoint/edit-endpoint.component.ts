import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { firstValueFrom } from 'rxjs';
import { EndpointsService } from 'src/app/core/services/endpoints.service';
@Component({
  selector: 'app-edit-endpoint',
  templateUrl: './edit-endpoint.component.html',
  styleUrls: ['./edit-endpoint.component.scss']
})
export class EditEndpointComponent implements OnInit {
  modalRef! : NzModalRef;
  tls_type = "A";
  @Input() endpoint = {
    url: '/var/run/docker.sock',
    name: null,
    protocol_index : 0,
    protocol: 'socket',
    tls: false,
    ca_certificat : null,
    tls_certificat : null,
    tls_key : null,
    port : 0,
    password : null,
    info : null
  }
  options = [
    { label: 'Socket', value: 'socket', icon: 'node-index' },
    { label: 'HTTP', value: 'http', icon: 'cloud-sync' },
    { label: 'SSH', value: 'ssh', icon: 'code' },
  ];

  checkOk = false
  constructor(private notificationService : NzNotificationService,
    private endpointsService : EndpointsService) { }

  ngOnInit(): void {
    this.endpoint.protocol_index = this.options.findIndex(el => el.value == this.endpoint.protocol);
    //@ts-ignore
    delete this.endpoint.info;
    if(this.endpoint.port){
      this.endpoint.url = this.endpoint.url + `:${this.endpoint.port}`
    }
    const uri = new URL(this.endpoint.url!);
    this.endpoint.url = uri.host;
    console.log(this.endpoint)
  }


  onConnectionTypeChange(index: any) {
    const protocol = this.options[index].value;
    this.endpoint.protocol = protocol;
    if (protocol == 'socket') {
      this.endpoint.url = "/var/run/docker.sock"
    } else if(protocol == "http") {
      this.endpoint.url = "localhost:2375"
    }else{
      this.endpoint.port = 22;
      this.endpoint.url = "ssh://user@127.0.0.1"
    }

    this.setOk(false)
  }


  beforeUpload = (file: NzUploadFile, _fileList: NzUploadFile[]) : any => {}


  onChange(evt : NzUploadChangeParam, type : string){
    delete evt.file.error;
    evt.fileList = evt.fileList.map(f => {f.status = "done"; return f})
    // @ts-ignore
    this.endpoint[type] = evt.file.originFileObj
    this.setOk(false)
  }


  async checkEndpoint(){
    let endpoint_clone = {...this.endpoint} 
    if (endpoint_clone.protocol == 'http') {
      const uri = new URL("http://"+endpoint_clone.url);
      let port = uri.port
      endpoint_clone.port = parseInt(port);
      if (endpoint_clone.tls) {
        endpoint_clone.url = "https://" + uri.hostname;
      } else {
        endpoint_clone.url = `http://` + uri.hostname;
      }
    } 
    const form_data = new FormData();
    for (let key in endpoint_clone) {
      //@ts-ignore
      form_data.append(key, (endpoint_clone[key] as string));
    }
    form_data.append('check_only', "1");
    this.checkOk  = await firstValueFrom(this.endpointsService.create(form_data)).then(res => {
      this.notificationService.success('Ping', "Host successfully reacheable");
      return true;
    }).catch(err => { this.notificationService.error('Error', "Host not reachable"); return false });

    this.setOk(this.checkOk)
  }


  setOk(value : boolean){
    this.modalRef.updateConfig({
      nzOkDisabled : !value
    });
  }
}
