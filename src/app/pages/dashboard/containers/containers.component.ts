import { Component, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ContainersService } from 'src/app/core/services/containers.service';
import { map } from 'rxjs/operators';
import { NzNotificationService } from 'ng-zorro-antd/notification';
@Component({
  selector: 'app-containers',
  templateUrl: './containers.component.html',
  styleUrls: ['./containers.component.scss']
})
export class ContainersComponent implements OnInit {
  checked = false;
  containers: any[] = [];
  setOfCheckedId = new Set<string>();
  constructor(private containerService: ContainersService,
    private notificationService: NzNotificationService) { }
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

}
