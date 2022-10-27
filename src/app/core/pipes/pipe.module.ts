import { NgModule } from '@angular/core';
import { FileSizePipe } from 'src/app/core/pipes/file-size.pipe';

@NgModule({
  declarations: [
   FileSizePipe
  ],
  imports: [
   
  ],
  providers : [FileSizePipe],
  exports: [FileSizePipe]
})
export class PipeModule { }
