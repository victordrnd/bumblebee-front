import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagePullModalComponent } from './image-pull-modal.component';

describe('ImagePullModalComponent', () => {
  let component: ImagePullModalComponent;
  let fixture: ComponentFixture<ImagePullModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImagePullModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImagePullModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
