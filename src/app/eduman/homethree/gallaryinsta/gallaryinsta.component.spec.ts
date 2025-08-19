import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GallaryinstaComponent } from './gallaryinsta.component';

describe('GallaryinstaComponent', () => {
  let component: GallaryinstaComponent;
  let fixture: ComponentFixture<GallaryinstaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GallaryinstaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GallaryinstaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
