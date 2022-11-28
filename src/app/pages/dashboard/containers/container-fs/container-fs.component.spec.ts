import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerFsComponent } from './container-fs.component';

describe('ContainerFsComponent', () => {
  let component: ContainerFsComponent;
  let fixture: ComponentFixture<ContainerFsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContainerFsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContainerFsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
