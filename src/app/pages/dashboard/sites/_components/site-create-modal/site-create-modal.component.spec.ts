import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteCreateModalComponent } from './site-create-modal.component';

describe('SiteCreateModalComponent', () => {
  let component: SiteCreateModalComponent;
  let fixture: ComponentFixture<SiteCreateModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SiteCreateModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SiteCreateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
