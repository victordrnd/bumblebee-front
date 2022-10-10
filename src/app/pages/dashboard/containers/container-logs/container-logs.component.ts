import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom, interval } from 'rxjs';
import { ContainersService } from 'src/app/core/services/containers.service';

@Component({
  selector: 'app-container-logs',
  templateUrl: './container-logs.component.html',
  styleUrls: ['./container-logs.component.scss']
})
export class ContainerLogsComponent implements OnInit {

  logs: any;
  container: any;
  sec_interval = 5;
  interval: any = null;
  constructor(private route: ActivatedRoute, private containerService: ContainersService,
    private router: Router) { }
  id: string | null = null;

  async ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.container = await firstValueFrom(this.containerService.find(this.id!));
    console.log(this.container)
    this.getLogs();
    this.registerRefresh();
  }


  async getLogs() {
    this.logs = await firstValueFrom(this.containerService.logs(this.id!))
    this.logs = this.logs.replaceAll("\u0000", "").replaceAll("\u001b", "").replaceAll("\u0002", "").replaceAll('[36m', "");
  }

  onBack() {
    this.router.navigate(["dashboard/containers"])
  }


  registerRefresh(evt: any = null) {
    if (evt) {
      this.sec_interval = evt;
    }
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.interval = setInterval(() => this.getLogs(), this.sec_interval * 1000)
  }


  downloadLogs() {
    const blob = new Blob([this.logs], {
      type: 'text/plain'
    });
    const url = window.URL.createObjectURL(blob);
    console.log(url)
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.href = url;
    a.download = `logs_${this.container.Names[0]}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

}
