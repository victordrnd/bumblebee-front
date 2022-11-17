import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { firstValueFrom } from 'rxjs';
import { SitesService } from 'src/app/core/services/sites.service';
import { SiteCreateModalComponent } from './_components/site-create-modal/site-create-modal.component';

@Component({
  selector: 'app-sites',
  templateUrl: './sites.component.html',
  styleUrls: ['./sites.component.scss']
})
export class SitesComponent implements OnInit {
  sites :any[] = [];
  constructor(private siteService : SitesService,
    private modalService : NzModalService,
    private notificationService : NzNotificationService) { }

  async ngOnInit() {
    this.getSites();
  }
  
  async getSites(){
    this.sites = await firstValueFrom(this.siteService.findAll()) as any[];
    this.sites = this.sites.map(s => {s.checks = s.checks.slice(-35);return s})
  }


  create(){
    this.modalService.create({
      nzContent : SiteCreateModalComponent,
      nzTitle : "Create new website check",
      nzOnOk : async (component) => {
        const site = {...component.site};
        site.url = site.protocol + site.url;
        console.log(site)
        await firstValueFrom(this.siteService.create(site)).then(res => this.notificationService.success('Success', "Site succesfully created")).catch(err => this.notificationService.error('Error', "An error has occured"));
        this.getSites();
      }
    })
  }

  async delete(id : number){
    await firstValueFrom(this.siteService.delete(id)).then(res => {
      this.notificationService.success("Success", "Website has been deleted successfully");
      this.getSites();
    }).catch(e => this.notificationService.error("Error", "An error has occured while deleting this website")); 
  }

}
