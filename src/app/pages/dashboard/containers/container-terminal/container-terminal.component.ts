import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ContainersService } from 'src/app/core/services/containers.service';
import { Terminal } from 'xterm';
import { AttachAddon } from 'xterm-addon-attach';

@Component({
  selector: 'app-container-terminal',
  templateUrl: './container-terminal.component.html',
  styleUrls: ['./container-terminal.component.scss']
})
export class ContainerTerminalComponent implements OnInit, AfterViewInit {

  container: any;
  id: string | null = null;
  terminal: any;
  constructor(private route: ActivatedRoute, private containerService: ContainersService,
    private router: Router, private cdr: ChangeDetectorRef) { }


  async ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.container = await firstValueFrom(this.containerService.find(this.id!));
    this.containerService.attach(this.container.Id).subscribe((res: any) => {
      // const attachAddon = new AttachAddon(socket);
      this.terminal.write(new TextDecoder().decode(res))
    })
  }


  ngAfterViewInit(): void {
    this.terminal = new Terminal({ fontFamily: 'Courier New', fontSize: 14, cursorBlink : true, rows: 50});

    this.terminal.open(document.getElementById('terminal')!);
    let line = "";
    const container_id = this.id;
    this.terminal.onKey((e: { key: string, domEvent: KeyboardEvent }) => {
      const ev = e.domEvent;
      const printable = !ev.altKey && !ev.ctrlKey && !ev.metaKey;
      if (ev.keyCode === 13) {
        this.containerService.exec(container_id!, line)
        this.terminal.write('\b \b'.repeat(line.length))  
        line = "";
      }
      else if (ev.keyCode === 8) {
        // Do not delete the prompt
        if (this.terminal._core.buffer.x > 2) {
          this.terminal.write('\b \b');
        }
      }
      else if (printable) {
        line += e.key;
        this.terminal.write(e.key);
      }
    });
  }


  onBack() {
    this.router.navigate(["dashboard/containers"])
  }
}
