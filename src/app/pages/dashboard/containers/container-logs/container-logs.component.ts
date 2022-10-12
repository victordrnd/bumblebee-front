import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom, interval, Observable, Subscription } from 'rxjs';
import { ContainersService } from 'src/app/core/services/containers.service';

@Component({
  selector: 'app-container-logs',
  templateUrl: './container-logs.component.html',
  styleUrls: ['./container-logs.component.scss']
})
export class ContainerLogsComponent implements OnInit, OnDestroy {

  logs: any= "";
  container: any;
  sec_interval = 5;
  interval: any = null;
  id: string | null = null;
  sse_observer! : Observable<String>;
  subscriptions : Array<Subscription>= [];
  constructor(private route: ActivatedRoute, private containerService: ContainersService,
    private router: Router, private cdr : ChangeDetectorRef) { }
 

  async ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.container = await firstValueFrom(this.containerService.find(this.id!));
    this.sse_observer = this.containerService.logs_sse(this.id!)
    const sb = this.sse_observer.subscribe((line:any) => {
      this.logs += line.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '').replaceAll("\u0000", "").replaceAll("\u001b", "").replaceAll("\u0002", "").replaceAll('[36m', "");
      this.cdr.detectChanges()
    });
    this.subscriptions.push(sb);
    this.getLogs();
  }

  async getLogs() {
    this.logs = await firstValueFrom(this.containerService.logs(this.id!))
  
    this.logs = this.logs.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '').replaceAll("\u0000", "").replaceAll("\u001b", "").replaceAll("\u0002", "").replaceAll('[36m', "");
  }

  onBack() {
    this.router.navigate(["dashboard/containers"])
  }


  downloadLogs() {
    const blob = new Blob([this.logs], {
      type: 'text/plain'
    });
    const url = window.URL.createObjectURL(blob);
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.href = url;
    a.download = `logs_${this.container.Names[0]}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  ngOnDestroy(): void {
    this.subscriptions.map(s => s.unsubscribe());
  }

}
