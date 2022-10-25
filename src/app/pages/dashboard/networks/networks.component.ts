import { Component, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { NetworksService } from 'src/app/core/services/networks.service';

@Component({
  selector: 'app-networks',
  templateUrl: './networks.component.html',
  styleUrls: ['./networks.component.scss']
})
export class NetworksComponent implements OnInit {
  networks :any[] = [];
  checked = false;
  setOfCheckedId = new Set<string>();
  constructor(private networkService : NetworksService) { }

  ngOnInit(): void {
    this.getNetworks();
  }


  async getNetworks() {
    this.networks = await firstValueFrom(this.networkService.list())
    this.setOfCheckedId.clear();
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
