import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZoomclassmainComponent } from './zoomclassmain.component';

describe('ZoomclassmainComponent', () => {
  let component: ZoomclassmainComponent;
  let fixture: ComponentFixture<ZoomclassmainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZoomclassmainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ZoomclassmainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
