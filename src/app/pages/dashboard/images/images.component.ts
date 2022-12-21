import { Component, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { firstValueFrom, map } from 'rxjs';
import { ImagesService } from 'src/app/core/services/images.service';
import { RegistriesService } from 'src/app/core/services/registries.service';
import { ImagePullModalComponent } from './_components/image-pull-modal/image-pull-modal.component';

@Component({
  selector: 'app-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.scss']
})
export class ImagesComponent implements OnInit {
  images: any[] = [];
  registries: any[] = [];
  loading = false;
  checked = false;
  setOfCheckedId = new Set<string>();
  imageName: string | null = null;
  registry_id: number | null = null
  constructor(private imageService: ImagesService,
    private registryService: RegistriesService,
    private modalService: NzModalService,
    private notificationService: NzNotificationService) { }

  ngOnInit(): void {
    this.getImages();
    this.getRegistries();
  }

  async getRegistries() {
    this.registries = await firstValueFrom(this.registryService.getAll() as any)
  }

  async getImages() {
    this.images = (await firstValueFrom(this.imageService.list())).map((image: any) => { if (image.RepoDigests) { image.imageTag = image.RepoDigests[0].split('@')[0]; } return image });
    this.images.forEach(async (image) => {
      image.uptodate = (await firstValueFrom(this.imageService.isUpToDate(image.Id)) as any).uptodate;
      if (image.uptodate == "undefined") {
        image.color = "grey"
      } else if (image.uptodate === true) {
        image.color = "green"
      } else {
        image.color = "red"
      }
    });
    this.setOfCheckedId.clear();
  }

  async pull() {
    const modalRef: NzModalRef = this.modalService.create({
      nzContent: ImagePullModalComponent,
      nzWidth: "60vw",
      nzTitle: "Pulling progress",
      nzComponentParams: {
        image_name: this.imageName!,
        registry_id: this.registry_id
      },
      nzOnOk: () => {
        this.getImages();
      },
      nzCancelText: null
    });
  }

  async downloadImage(image: any) {
    console.log(image.Id + '.tar');
    let blob = await fetch(this.imageService.download(image.Id)).then(r => r.blob());
    let link: any = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = image.RepoTags[0] + '.tar';
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  async delete() {
    this.loading = true;
    const reqs = this.imageService.delete(Array.from(this.setOfCheckedId))

    await Promise.all(reqs.map(req => firstValueFrom(req.pipe(map(c => { this.notificationService.success("Success", "Image has successfully been deleted"); }))).catch(e => {
      this.notificationService.error('Error', e.error.message)
    })))
    await this.getImages();
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
