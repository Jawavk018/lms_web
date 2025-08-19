import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupvideoComponent } from './popupvideo.component';

describe('PopupvideoComponent', () => {
  let component: PopupvideoComponent;
  let fixture: ComponentFixture<PopupvideoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopupvideoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupvideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
