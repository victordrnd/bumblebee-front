import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ContainersService } from 'src/app/core/services/containers.service';
//@ts-ignore
import untar from "js-untar";
@Component({
  selector: 'app-container-fs',
  templateUrl: './container-fs.component.html',
  styleUrls: ['./container-fs.component.scss']
})
export class ContainerFsComponent implements OnInit {

  files :any = [];
  id!: string|null;
  constructor(private containerService : ContainersService,
    private route : ActivatedRoute) { }

  async ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.files = await firstValueFrom(this.containerService.filesystem(this.id!));
    console.log(toArrayBuffer(Buffer.from(this.files)))
    untar(toArrayBuffer(Buffer.from(this.files))).then((files:any) => console.log(files));
  }

}

export function toArrayBuffer(buffer : Buffer) {
  const ab = new ArrayBuffer(buffer.length);
  const view = new Uint8Array(ab);
  for (let i = 0; i < buffer.length; ++i) {
      view[i] = buffer[i];
  }
  return ab;
}
