import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { firstValueFrom, map } from 'rxjs';
import { VolumesService } from 'src/app/core/services/volumes.service';

@Component({
  selector: 'app-volumes',
  templateUrl: './volumes.component.html',
  styleUrls: ['./volumes.component.scss']
})
export class VolumesComponent implements OnInit {

  volumes :any[] = [];
  checked = false;
  loading = false;
  setOfCheckedId = new Set<string>();
  constructor(private volumesService : VolumesService,
    private notificationService : NzNotificationService) { }

  ngOnInit(): void {
    this.getNetworks();
  }


  async getNetworks() {
    this.volumes = await firstValueFrom(this.volumesService.list())
    this.setOfCheckedId.clear();
  }


  async delete(){
    this.loading = true;
    const reqs = this.volumesService.delete(Array.from(this.setOfCheckedId))

    await Promise.all(reqs.map(req => firstValueFrom(req.pipe(map(c => { this.notificationService.success("Success", "Volume has successfully been deleted"); }))).catch(e => {
      this.notificationService.error('Error', e.error.message)
    })))
    await this.getNetworks();
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
    this.volumes
      .forEach(({ Id }) => this.updateCheckedSet(Id, checked));
  }

}
