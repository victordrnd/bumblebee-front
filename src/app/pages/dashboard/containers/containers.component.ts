import { Component, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ContainersService } from 'src/app/core/services/containers.service';
import { map } from 'rxjs/operators';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzModalService } from 'ng-zorro-antd/modal';
import { RenameContainerModalComponent } from './_components/rename-container-modal/rename-container-modal.component';
import { EndpointsService } from 'src/app/core/services/endpoints.service';
@Component({
  selector: 'app-containers',
  templateUrl: './containers.component.html',
  styleUrls: ['./containers.component.scss']
})
export class ContainersComponent implements OnInit {
  checked = false;
  containers: any[] = [];
  setOfCheckedId = new Set<string>();
  isRestarting = false;
  constructor(private containerService: ContainersService,
    private notificationService: NzNotificationService,
    private endpointService : EndpointsService,
    private modalService : NzModalService) { }
  ngOnInit(): void {
    this.getContainers();
    this.setOfCheckedId.size
  }


  async getContainers() {
    this.containers = await firstValueFrom(this.containerService.list())
    this.containers = this.containers.map(c => { c.Ports = c.Ports.filter((p: any) => p.IP != "::"); return c })
    this.setOfCheckedId.clear();
  }

  async start() {
    const reqs = this.containerService.start(Array.from(this.setOfCheckedId))
    await Promise.all(reqs.map(req => firstValueFrom(req.pipe(map(c => { this.notificationService.success('Container successfully started', c.Name) })))))
    this.getContainers();
  }


  async stop() {
    const reqs = this.containerService.stop(Array.from(this.setOfCheckedId))
    await Promise.all(reqs.map(req => firstValueFrom(req.pipe(map(c => { this.notificationService.success('Container successfully stopped', c.Name) })))))
    this.getContainers();
  }


  
  async restart() {
    this.isRestarting = true;
    const reqs = this.containerService.restart(Array.from(this.setOfCheckedId))
    await Promise.all(reqs.map(req => firstValueFrom(req.pipe(map(c => { this.notificationService.success('Container successfully restarted', c.Name) })))))
    this.isRestarting = false;
    this.getContainers();
  }

  async delete(){
    const reqs = this.containerService.delete(Array.from(this.setOfCheckedId))
    await Promise.all(reqs.map(req => firstValueFrom(req.pipe(map(c => { this.notificationService.success('Container successfully deleted', "") }))).catch(e => {
      this.notificationService.error('Error', e.error.message)
    })))
    this.getContainers();
  }


  updateCheckedSet(id: string, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  onItemChecked(id: string, checked: boolean): void {
    this.updateCheckedSet(id, checked);
  }

  onAllChecked(checked: boolean): void {
    this.containers
      .forEach(({ Id }) => this.updateCheckedSet(Id, checked));
  }

  openUrl(port : number){
    const endpoint = this.endpointService.currentEnvValue;
    if(endpoint.use_socket){
      window.open(`http://localhost:${port}`, "_blank");
    }else{
      window.open(`${endpoint.url}:${port}`, "_blank");
    }
  }

  openRenameModal(container :any){
    this.modalService.create({
      nzContent : RenameContainerModalComponent,
      nzTitle : "Rename container",
      nzComponentParams : {name : container.Name},
      nzOnOk : async (component) => {
        await firstValueFrom(this.containerService.rename(container.Id, component.name)).then(r => {
          this.notificationService.success('Container has been renamed successfully', container.name);
          this.getContainers();
        }).catch(err => this.notificationService.error('Error', "An error has occured while trying to rename your container"));
      }
    })
  }

  openTerminal(container : any){
    
  }


  isSwarm(container : any){
    return Object.keys(container.Labels).includes('com.docker.swarm.node.id')
  }

}
