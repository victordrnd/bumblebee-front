import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { firstValueFrom } from 'rxjs';
import { RegistriesService } from 'src/app/core/services/registries.service';
import { CreateRegistryModalComponent } from './_components/create-registry-modal/create-registry-modal.component';

@Component({
  selector: 'app-registries',
  templateUrl: './registries.component.html',
  styleUrls: ['./registries.component.scss']
})
export class RegistriesComponent implements OnInit {

  registries : any[] = [];
  constructor(private registryService : RegistriesService,
    private modalService : NzModalService) { }

  ngOnInit() {
    this.fetchRegistries()
  }
  
  
  async fetchRegistries(){
    this.registries = await firstValueFrom(this.registryService.getAll()) as any[];
  }


  addRegistry(){
    this.modalService.create({
      nzTitle : "Add new registry",
      nzContent : CreateRegistryModalComponent,
      nzOnOk : async (component) => {
        await firstValueFrom(this.registryService.create(component.registry));
        this.fetchRegistries();
      }
    })
  }


  delete(registry_id : number){
    this.registryService.delete(registry_id)
  }
}
