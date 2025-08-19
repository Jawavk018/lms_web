import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HerothreeComponent } from './herothree.component';

describe('HerothreeComponent', () => {
  let component: HerothreeComponent;
  let fixture: ComponentFixture<HerothreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HerothreeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HerothreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
