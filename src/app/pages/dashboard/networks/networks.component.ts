import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { firstValueFrom, map } from 'rxjs';
import { NetworksService } from 'src/app/core/services/networks.service';

@Component({
  selector: 'app-networks',
  templateUrl: './networks.component.html',
  styleUrls: ['./networks.component.scss']
})
export class NetworksComponent implements OnInit {
  networks :any[] = [];
  checked = false;
  loading = false;
  setOfCheckedId = new Set<string>();
  constructor(private networkService : NetworksService,
    private notificationService : NzNotificationService) { }

  ngOnInit(): void {
    this.getNetworks();
  }


  async getNetworks() {
    this.networks = await firstValueFrom(this.networkService.list())
    this.setOfCheckedId.clear();
  }


  async delete(){
    this.loading = true;
    const reqs = this.networkService.delete(Array.from(this.setOfCheckedId))

    await Promise.all(reqs.map(req => firstValueFrom(req.pipe(map(c => { this.notificationService.success("Success", "Network has successfully been deleted"); }))).catch(e => {
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
    this.networks
      .forEach(({ Id }) => this.updateCheckedSet(Id, checked));
  }
}
