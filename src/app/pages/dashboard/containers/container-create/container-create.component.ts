import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { registry } from 'chart.js';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { firstValueFrom } from 'rxjs';
import { ContainersService } from 'src/app/core/services/containers.service';
import { VolumesService } from 'src/app/core/services/volumes.service';

@Component({
  selector: 'app-container-create',
  templateUrl: './container-create.component.html',
  styleUrls: ['./container-create.component.scss']
})
export class ContainerCreateComponent implements OnInit {
  restartPolicy = "never"
  ExposedPorts : any[]= [];
  Env : any[] = [];
  Labels : any[] = [];
  Volumes : any[] = []
  validateForm!: UntypedFormGroup;
  volumeList = [];
  loading = false;
  constructor(private fb: FormBuilder,
    private volumeService : VolumesService,
    private containerService : ContainersService,
    private notificationService : NzNotificationService,
    private router: Router) { }

  async ngOnInit(){
    const { required, maxLength, minLength, email} = Validators;
    this.validateForm = this.fb.group({
      name: [null, [required, maxLength(20)]],
      Image: [null, [required]],
      User : ['root', [required]],
      Tty : [true, [required]],
      Env :  this.fb.array([]),
      Cmd : [null, []],
      // Labels : this.fb.array([]),
      registry : ["Dockerhub", []],
    });
    this.volumeList = await firstValueFrom(this.volumeService.list())
    this.addPortPublishing();
  }


  addPortPublishing(){
    this.ExposedPorts.push({
      host : null,
      container : null,
      protocol : "tcp"
    });
  }
  deletePort(index:  number){
    this.ExposedPorts.splice(index, 1)
  }

  addVolumeMapping(){
    this.Volumes.push({
      container : null,
      host : null,
      type : "bind"
    })
  }

  addEnvVariable(){
    this.Env.push({name : null, value : null})
  }

  addLabel(){
    this.Labels.push({name : null, value : null})
  }

  deleteVolume(index : number){
    this.Volumes.splice(index, 1)
  }

  deleteEnv(index : number){
    this.Env.splice(index, 1)
  }

  deleteLabel(index : number){
    this.Labels.splice(index, 1)
  }


  async submitForm(){
    let body = this.validateForm.value;
    body.HostConfig = {};
    body.HostConfig.Binds = this.buildVolumes();
    body.HostConfig.PortBindings = this.buildPorts();
    body.HostConfig.restartPolicy = {Name : this.restartPolicy, MaximumRetryCount : 0}
    body.Labels = this.buildLabels();
    body.Env = this.buildEnv();

    this.loading = true
    await firstValueFrom(this.containerService.create(body)).then(res =>{
      this.notificationService.success('Success', "Container have been created");
      this.onBack();
    }).catch(err => {
      this.notificationService.error('Error', err.error.message);
    }).finally(() => this.loading = false)
  }

  buildPorts(){
    const map = new Map()
    this.ExposedPorts.forEach(port => {
      if(port.container && port.host){
        const key = port.container+"/"+ port.protocol;
        let mapping = [];
        if(map.has(key)){
          mapping = map.get(key);
        }
        mapping = [...mapping, {HostPort : `${port.host}`}]
        map.set(key,mapping);
      }
    });
    return Object.fromEntries(map)
  }

  buildVolumes(){
    return this.Volumes.map(v => v.host && v.container ? `${v.host}:${v.container}` : null).filter(x => !!x);
  }

  buildLabels(){
    return this.Labels.reduce(function(r, e) {
      r[e.name] = e.value;
      return r;
    }, {});
  }

  buildEnv(){
    return this.Env.map(env => env.name ? `${env.name.toUpperCase()}=${env.value || ""}` : null).filter(x => !!x);
  }
  onBack() {
    this.router.navigate(["dashboard/containers"])
  }


}
