import { Component, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ImagesService } from 'src/app/core/services/images.service';

@Component({
  selector: 'app-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.scss']
})
export class ImagesComponent implements OnInit {
  images: any[] = [];
  checked = false;
  setOfCheckedId = new Set<string>();
  constructor(private imagesSerive : ImagesService) { }

  ngOnInit(): void {
    this.getImages();
  }


  async getImages() {
    this.images = await firstValueFrom(this.imagesSerive.list())
    this.images = this.images.map(c => { c.Ports = c.Ports.filter((p: any) => p.IP != "::"); return c });
    console.log(this.images)
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
    this.images
      .forEach(({ Id }) => this.updateCheckedSet(Id, checked));
  }
}
