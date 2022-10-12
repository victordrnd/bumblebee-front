import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenameContainerModalComponent } from './rename-container-modal.component';

describe('RenameContainerModalComponent', () => {
  let component: RenameContainerModalComponent;
  let fixture: ComponentFixture<RenameContainerModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RenameContainerModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RenameContainerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
