import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { catchError, Observable, Subscription, throwError } from 'rxjs';
import { ImagesService } from 'src/app/core/services/images.service';

@Component({
  selector: 'app-image-pull-modal',
  templateUrl: './image-pull-modal.component.html',
  styleUrls: ['./image-pull-modal.component.scss']
})
export class ImagePullModalComponent implements OnInit, OnDestroy {

  constructor(private imageService : ImagesService,
    private cdr : ChangeDetectorRef) { }
  

  progress : any[] = [];
  sse_observer : Observable<any> | null = null;;
  image_name? : string | null = null;
  registry_id : number | null = null;
  subscriptions : Subscription[]= [];
  ngOnInit(): void {
    const sb = this.imageService!.pull(this.image_name!, this.registry_id).pipe(catchError(err => {
      if(err.data){
        this.progress.push({status : "Error", progress : err.data});
      }
      return throwError(() => err)
    })).subscribe(evt => {
      let json : any = JSON.parse(evt);
      console.log(json)
      this.progress.push(json);
      if(this.progress.length > 30){
        this.progress.shift();
      }
      this.cdr.detectChanges();
    });
    this.subscriptions.push(sb);
  }


  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe())
  }
}
