import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReverseProxyComponent } from './reverse-proxy.component';

describe('ReverseProxyComponent', () => {
  let component: ReverseProxyComponent;
  let fixture: ComponentFixture<ReverseProxyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReverseProxyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReverseProxyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
