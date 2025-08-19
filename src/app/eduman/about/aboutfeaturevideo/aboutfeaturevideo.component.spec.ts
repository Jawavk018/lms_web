import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutfeaturevideoComponent } from './aboutfeaturevideo.component';

describe('AboutfeaturevideoComponent', () => {
  let component: AboutfeaturevideoComponent;
  let fixture: ComponentFixture<AboutfeaturevideoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AboutfeaturevideoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutfeaturevideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
