import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { firstValueFrom } from 'rxjs';
import { DnsService } from 'src/app/core/services/dns.service';

@Component({
  selector: 'app-dns',
  templateUrl: './dns.component.html',
  styleUrls: ['./dns.component.scss']
})
export class DnsComponent implements OnInit {
  dns_addresses = ""
  dns : any[] = [];
  constructor(private dnsService : DnsService,
    private notificationService : NzNotificationService) { }

  async ngOnInit() {
    this.dns = await firstValueFrom(this.dnsService.list()) as any[];
    this.dns_addresses = this.dns.map(x => x.ip).join('\n');
  }


  async save(){
    const dns = this.dns_addresses.split('\n');
    const isIpAddress = (str : string) => {
      const ipPattern = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/;
      return ipPattern.test(str);
    }
    if(dns.map(ip => isIpAddress(ip)).every(x => x === true)){
      await firstValueFrom(this.dnsService.save(dns.map(x => ({ip : x}))))
      .then(res => this.notificationService.success('Success', "DNS configuration have been saved"))
      .catch(err => this.notificationService.error('Error', "An error has occured"))
    }else{
      this.notificationService.error("Error","Invalid IP Address")
    }

  }


}
