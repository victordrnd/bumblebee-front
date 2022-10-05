import { Component, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ContainersService } from 'src/app/core/services/containers.service';

@Component({
  selector: 'app-containers',
  templateUrl: './containers.component.html',
  styleUrls: ['./containers.component.scss']
})
export class ContainersComponent implements OnInit {

  containers : any[] = [];
  constructor(private containerService : ContainersService) { }

  ngOnInit(): void {
    this.getContainers();
  }
  
  
  async getContainers(){
    this.containers = await firstValueFrom(this.containerService.list())
  }

}
