import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { firstValueFrom } from 'rxjs';
import { ContainersService } from 'src/app/core/services/containers.service';
import { NetworksService } from 'src/app/core/services/networks.service';
import { UsersService } from 'src/app/core/services/users.service';

@Component({
  selector: 'app-reverse-proxy',
  templateUrl: './reverse-proxy.component.html',
  styleUrls: ['./reverse-proxy.component.scss']
})
export class ReverseProxyComponent implements OnInit {

  currentStep = 0;
  email = null
  isActivated = false;
  loading = true;
  containers = [];
  networkList :any[] = [];
  constructor(private containerService: ContainersService,
    private networkService : NetworksService,
    private notificationService: NzNotificationService,
    private userService : UsersService) { }

  async ngOnInit() {
    this.init()
  }

  async init(){
    this.containers = await firstValueFrom(this.containerService.list())
    this.isActivated = this.containers.filter((c: any) => c.Image.includes('traefik')).length > 0;
    this.networkList = await firstValueFrom(this.networkService.list());
    this.loading = false;
  }
  async toggleReverseProxy(evt: boolean) {
    if (evt) {
      // Enable traefik
      let body = {
        name: "traefik-bumblebee",
        Image: "traefik:v2.9",
        HostConfig: {
          Binds: this.buildVolumes([{
            container: "/var/run/docker.sock",
            host: "/var/run/docker.sock",
            type: "bind"
          },
          {
            container: "/letsencrypt",
            host: "/tmp/letsencrypt",
            type: "bind"
          }
          ]),
          PortBindings: this.buildPorts([
            {
              host: 443,
              container: 443,
              protocol: "tcp"
            },
            {
              host: 80,
              container: 80,
              protocol: "tcp"
            },
          ]),
          NetworkMode : "web",
          NetworkingConfig : { EndpointsConfig: this.buildNetwork() },
          restartPolicy: { Name: "unless-stopped", MaximumRetryCount: 0 }
        },
        Cmd: this.getCmd()
        // Labels : this.buildLabels();
      };
      this.loading = true
      await firstValueFrom(this.containerService.create(body)).then(res => {
        console.log(res);
        this.notificationService.success('Success', "Reverse Proxy successfully enabled");
      }).catch(err => {
        this.notificationService.error('Error', err.error.message);
      }).finally(() => this.loading = false)

    } else {
      const traefik :any = this.containers.find((c:any) => c.Image.includes("traefik"));
      console.log(traefik);
      if(traefik){
        await firstValueFrom(this.containerService.stop([traefik.Id])[0]);
        await firstValueFrom(this.containerService.delete([traefik.Id])[0]);
        this.notificationService.success('Success', "Reverse Proxy successfully deleted");
      }
    }
  }

  getCmd() {
    const currentUser = this.userService.currentUserValue;
    return [
      "--log.level=DEBUG",
      "--api.insecure=true",
      "--providers.docker=true",
      "--providers.docker.exposedbydefault=false",
      "--entrypoints.web.address=:80",
      "--entrypoints.websecure.address=:443",
      // "--entrypoints.web.http.redirections.entrypoint.to=websecure",
      // "--entrypoints.web.http.redirections.entrypoint.scheme=https",
      "--certificatesresolvers.myresolver.acme.httpchallenge=true",
      "--certificatesresolvers.myresolver.acme.httpchallenge.entrypoint=web",
      `--certificatesresolvers.myresolver.acme.email=${currentUser.attributes.email}`,
      "--certificatesresolvers.myresolver.acme.storage=/letsencrypt/acme.json",
    ]
  }

  buildNetwork() {
    const map = new Map();
    const net_info = this.networkList.find(el => el.Name == "web");
    map.set("web", { NetworkId: net_info.Id });
    return Object.fromEntries(map);
  }


  buildPorts(ports: any[]) {
    const map = new Map()
    ports.forEach(port => {
      if (port.container && port.host) {
        const key = port.container + "/" + port.protocol;
        let mapping = [];
        if (map.has(key)) {
          mapping = map.get(key);
        }
        mapping = [...mapping, { HostPort: `${port.host}` }]
        map.set(key, mapping);
      }
    });
    return Object.fromEntries(map)
  }

  buildVolumes(volumes: any[]) {
    return volumes.map(v => v.host && v.container ? `${v.host}:${v.container}` : null).filter(x => !!x);
  }

  buildLabels(labels: any[]) {
    return labels.reduce((r, e) => {
      r[e.name] = e.value;
      return r;
    }, {});
  }
}
