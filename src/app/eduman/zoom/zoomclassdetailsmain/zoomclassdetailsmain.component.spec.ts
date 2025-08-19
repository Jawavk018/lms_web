import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZoomclassdetailsmainComponent } from './zoomclassdetailsmain.component';

describe('ZoomclassdetailsmainComponent', () => {
  let component: ZoomclassdetailsmainComponent;
  let fixture: ComponentFixture<ZoomclassdetailsmainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZoomclassdetailsmainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ZoomclassdetailsmainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
