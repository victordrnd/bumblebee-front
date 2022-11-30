import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRegistryModalComponent } from './create-registry-modal.component';

describe('CreateRegistryModalComponent', () => {
  let component: CreateRegistryModalComponent;
  let fixture: ComponentFixture<CreateRegistryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateRegistryModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateRegistryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
