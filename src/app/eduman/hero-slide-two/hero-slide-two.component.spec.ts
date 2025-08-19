import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroSlideTwoComponent } from './hero-slide-two.component';

describe('HeroSlideTwoComponent', () => {
  let component: HeroSlideTwoComponent;
  let fixture: ComponentFixture<HeroSlideTwoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HeroSlideTwoComponent]
    });
    fixture = TestBed.createComponent(HeroSlideTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
