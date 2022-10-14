import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';

@Component({
  selector: 'app-edit-endpoint',
  templateUrl: './edit-endpoint.component.html',
  styleUrls: ['./edit-endpoint.component.scss']
})
export class EditEndpointComponent implements OnInit {

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
    password : null
  }
  options = [
    { label: 'Socket', value: 'socket', icon: 'node-index' },
    { label: 'HTTP', value: 'http', icon: 'cloud-sync' },
    { label: 'SSH', value: 'ssh', icon: 'code' },
  ];
  constructor() { }

  ngOnInit(): void {
  }


  onConnectionTypeChange(index: any) {
    const protocol = this.options[index].value;
    this.endpoint.protocol = protocol;
    console.log(this.endpoint.protocol)
    if (protocol == 'socket') {
      this.endpoint.url = "/var/run/docker.sock"
    } else if(protocol == "http") {
      this.endpoint.url = "localhost:2375"
    }else{
      this.endpoint.port = 22;
      this.endpoint.url = "ssh://user@127.0.0.1"
    }
  }


  beforeUpload = (file: NzUploadFile, _fileList: NzUploadFile[]) : any => {
    // new Observable((observer: Observer<boolean>) => {
    //   const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    //   if (!isJpgOrPng) {
    //     this.msg.error('You can only upload JPG file!');
    //     observer.complete();
    //     return;
    //   }
    //   const isLt2M = file.size! / 1024 / 1024 < 2;
    //   if (!isLt2M) {
    //     this.msg.error('Image must smaller than 2MB!');
    //     observer.complete();
    //     return;
    //   }
    //   observer.next(isJpgOrPng && isLt2M);
    //   observer.complete();
    // });
  }


  onChange(evt : NzUploadChangeParam, type : string){
    delete evt.file.error;
    evt.fileList = evt.fileList.map(f => {f.status = "done"; return f})
    console.log(evt, type)
    // @ts-ignore
    this.endpoint[type] = evt.file.originFileObj

  }
}
