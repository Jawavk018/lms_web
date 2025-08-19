import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutpopupvideoComponent } from './aboutpopupvideo.component';

describe('AboutpopupvideoComponent', () => {
  let component: AboutpopupvideoComponent;
  let fixture: ComponentFixture<AboutpopupvideoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AboutpopupvideoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutpopupvideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
