import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom, take } from 'rxjs';
import { ContainersService } from 'src/app/core/services/containers.service';
import { Terminal } from 'xterm';
@Component({
  selector: 'app-container-terminal',
  templateUrl: './container-terminal.component.html',
  styleUrls: ['./container-terminal.component.scss']
})
export class ContainerTerminalComponent implements OnInit, AfterViewInit, OnDestroy {

  container: any;
  id: string | null = null;
  terminal: any;
  subscriptions: any[] = [];
  constructor(private route: ActivatedRoute, private containerService: ContainersService,
    private router: Router, private cdr: ChangeDetectorRef) { }



  async ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.container = await firstValueFrom(this.containerService.find(this.id!));
    const sb = this.containerService.attach(this.container.Id).subscribe((res: any) => {
      this.terminal.write(new TextDecoder().decode(res))
    });
    this.subscriptions.push(sb);
  }


  ngAfterViewInit(): void {
    this.terminal = new Terminal({
      fontFamily: 'Courier New', fontSize: 15, cursorBlink: true, rows: 40, letterSpacing: 0, cols: 180,
      theme: { background: '#2c2e31', black: "#2c2e31", cursorAccent: "#2c2e31" }
    });
    this.terminal.open(document.getElementById('terminal')!);
    let line = "";
    const container_id = this.id;
    this.terminal.onKey((e: { key: string, domEvent: KeyboardEvent }) => {
      const ev = e.domEvent;
      const printable = !ev.altKey && !ev.ctrlKey && !ev.metaKey && !ev.key.includes("Arrow");
      if (ev.code == "Enter") {
        this.containerService.exec(container_id!, line)
        this.terminal.write('\r');
        line = "";
      }
      else if (ev.key === "Backspace") {
        // if(line.length){
        //   line = line.substring(1);
        //   if (this.terminal._core.buffer.x > 2) {
        //     this.terminal.write('\b \b');
        //   }
        // }
        if(line.length){
          if (this.terminal._core.buffer.x > 2) {
            line = line.slice(0, -1);
            this.terminal.write('\b \b');
          }
        }
      }
      else if (printable) {
        line += e.key;
        this.terminal.write(e.key);
      }
    });
    this.terminal.attachCustomKeyEventHandler(async (arg:any) => {
      if (arg.ctrlKey && arg.code === "KeyC" && arg.type === "keydown") {
        const selection = this.terminal.getSelection();
        if (selection) {
          navigator.clipboard.writeText(selection);
          return false;
        }
      }
      if (arg.ctrlKey && arg.code === "KeyV" && arg.type === "keydown") {
        const content = await navigator.clipboard.readText();
        this.terminal.write(content);
      }
      return true;
  }); 
  }


  onBack() {
    this.router.navigate(["dashboard/containers"])
  }


  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe())
    this.containerService.detach()
  }
}
