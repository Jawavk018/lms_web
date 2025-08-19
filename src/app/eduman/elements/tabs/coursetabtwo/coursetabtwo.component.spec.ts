import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursetabtwoComponent } from './coursetabtwo.component';

describe('CoursetabtwoComponent', () => {
  let component: CoursetabtwoComponent;
  let fixture: ComponentFixture<CoursetabtwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoursetabtwoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoursetabtwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
