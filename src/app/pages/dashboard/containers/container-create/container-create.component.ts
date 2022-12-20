import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { registry } from 'chart.js';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzBytesPipe } from 'ng-zorro-antd/pipes';
import { firstValueFrom } from 'rxjs';
import { ContainersService } from 'src/app/core/services/containers.service';
import { EndpointsService } from 'src/app/core/services/endpoints.service';
import { NetworksService } from 'src/app/core/services/networks.service';
import { VolumesService } from 'src/app/core/services/volumes.service';

@Component({
  selector: 'app-container-create',
  templateUrl: './container-create.component.html',
  styleUrls: ['./container-create.component.scss']
})
export class ContainerCreateComponent implements OnInit {
  restartPolicy = ""
  ExposedPorts: { host: string | null; container: string | null; protocol: 'tcp' | 'udp' }[] = [];
  Env: any[] = [];
  Labels: any[] = [];
  Volumes: any[] = []
  validateForm!: UntypedFormGroup;
  volumeList = [];
  networksList: any[] = [];
  network: any = null;
  runtime = {
    Privileged: false,
    MemoryReservation: 0,
    Memory: 0
  };
  endpoint: any;
  loading = false;
  isTraefikEnabled = false;
  traefik: any = {
    enabled: false,
    sites: [
      {
        domain: null,
        tls: false,
        port: 8000
      }
    ]
  }
  ip: string | null = null;
  dnsCheck = false;
  constructor(private fb: FormBuilder,
    private volumeService: VolumesService,
    private networkService: NetworksService,
    private containerService: ContainersService,
    private notificationService: NzNotificationService,
    private endpointService: EndpointsService,
    private nzBytesPipe: NzBytesPipe,
    private router: Router) { }

  async ngOnInit() {
    const { required, maxLength, minLength, email } = Validators;
    this.validateForm = this.fb.group({
      name: [null, [required, maxLength(20)]],
      Image: [null, [required]],
      User: ['root', [required]],
      Tty: [true, [required]],
      Env: this.fb.array([]),
      Cmd: [null, []],
      // Labels : this.fb.array([]),
      registry: ["Dockerhub", []],
    });
    this.volumeList = await firstValueFrom(this.volumeService.list())
    this.addPortPublishing();
    this.networksList = await firstValueFrom(this.networkService.list());
    this.checkTraefikEnabled();
    this.ip = (await firstValueFrom(this.networkService.getIp()) as any).ip! as string;
    this.endpoint = this.endpointService.currentEnvValue.info;
  }


  async checkTraefikEnabled() {
    const containers = await firstValueFrom(this.containerService.list())
    this.isTraefikEnabled = containers.filter((c: any) => c.Image.includes('traefik')).length > 0;
  }

  addEntryPoint() {
    this.traefik.sites.push({
      domain: null,
      tls: false,
      port: 8000
    })
  }


  deleteSite(index: number) {
    this.traefik.sites.splice(index, 1);
  }

  addPortPublishing() {
    this.ExposedPorts.push({
      host: null,
      container: null,
      protocol: "tcp"
    });
  }
  deletePort(index: number) {
    this.ExposedPorts.splice(index, 1)
  }

  addVolumeMapping() {
    this.Volumes.push({
      container: null,
      host: null,
      type: "bind"
    })
  }

  addEnvVariable() {
    this.Env.push({ name: null, value: null })
  }

  addLabel() {
    this.Labels.push({ name: null, value: null })
  }

  deleteVolume(index: number) {
    this.Volumes.splice(index, 1)
  }

  deleteEnv(index: number) {
    this.Env.splice(index, 1)
  }

  deleteLabel(index: number) {
    this.Labels.splice(index, 1)
  }


  async submitForm() {
    let body = this.validateForm.value;
    body.HostConfig = this.runtime;
    body.HostConfig.Binds = this.buildVolumes();
    body.HostConfig.PortBindings = this.buildPorts();
    body.HostConfig.restartPolicy = { Name: this.restartPolicy, MaximumRetryCount: 0 }
    body.Labels = this.buildLabels();
    if (this.traefik.enabled) {
      body.Labels = { ...body.Labels, ...this.buildTraefikLabels() }
      this.network = this.networksList.find((el: any) => el.Name == "web")?.Id;
    }
    body.NetworkingConfig = { EndpointsConfig: this.buildNetworks() };
    console.log(body.NetworkingConfig);
    body.Env = this.buildEnv();
    this.loading = true
    await firstValueFrom(this.containerService.create(body)).then(res => {
      this.notificationService.success('Success', "Container have been created");
      this.onBack();
    }).catch(err => {
      this.notificationService.error('Error', err.error.message);
    }).finally(() => this.loading = false)
  }

  buildPorts() {
    const map = new Map()
    this.ExposedPorts.forEach(port => {
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

  buildVolumes() {
    return this.Volumes.map(v => v.host && v.container ? `${v.host}:${v.container}` : null).filter(x => !!x);
  }

  buildLabels() {
    return this.Labels.reduce(function (r, e) {
      r[e.name] = e.value;
      return r;
    }, {});
  }

  buildEnv() {
    return this.Env.map(env => env.name ? `${env.name.toUpperCase()}=${env.value || ""}` : null).filter(x => !!x);
  }

  buildNetworks() {
    const map = new Map();
    const net_info = this.networksList.find(el => el.Id == this.network);
    map.set(net_info.Name, { NetworkId: this.network });
    return Object.fromEntries(map);
  }

  buildTraefikLabels() {
    const sites = this.traefik.sites.map((s: any) => ({ ...s }));

    const res = sites.map((site: { domain: string, tls: boolean, port: number }) => {
      const service_name = this.validateForm.value.name + "_" + (Math.random() + 1).toString(36).substring(7);
      if (site.tls) {
        return {
          "traefik.enable": "true",
          [`traefik.http.routers.${service_name}-https.rule`]: `Host("${site.domain}")`,
          [`traefik.http.routers.${service_name}-https.tls`]: "true",
          [`traefik.http.routers.${service_name}-https.tls.certresolver`]: "myresolver",
          [`traefik.http.routers.${service_name}-https.entrypoints`]: "websecure",
          [`traefik.http.routers.${service_name}-https.service`]: service_name,
          [`traefik.http.services.${service_name}.loadbalancer.server.port`]: site.port.toString(),
          ["traefik.docker.network"]: "web"
        }
      } else {
        return {
          "traefik.enable": "true",
          [`traefik.http.routers.${service_name}-http.rule`]: `Host("${site.domain}")`,
          [`traefik.http.routers.${service_name}-http.entrypoints`]: "web",
          [`traefik.http.routers.${service_name}-http.service`]: service_name,
          [`traefik.http.services.${service_name}.loadbalancer.server.port`]: site.port.toString(),
          ["traefik.docker.network"]: "web"
        }
      }
    });
    // var mapped = res.map(site => ({ [site.key]: item.value }));
    var newObj = Object.assign({}, ...res);
    console.log(newObj)
    return newObj;
  }


  async checkDNS(domain: string) {
    const res: any = await firstValueFrom(this.networkService.checkDNS(domain));
    if (this.ip && domain) {
      const res: any = await firstValueFrom(this.networkService.checkDNS(domain));
      if (res.Answer) {
        this.dnsCheck = this.ip == res.address
        if (this.dnsCheck) {
          this.notificationService.success('Success', "DNS Record found !")
          return;
        }
      }
    }
    this.notificationService.error("Not Found", `Invalid DNS record found for this domain ${res ? " Found : " + res.address : ""}`);
  }


  onBack() {
    this.router.navigate(["dashboard/containers"])
  }


  tipFormatter = (value: number) => {
    return this.nzBytesPipe.transform(value)
  }
}
