import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistriesComponent } from './registries.component';

describe('RegistriesComponent', () => {
  let component: RegistriesComponent;
  let fixture: ComponentFixture<RegistriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistriesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
