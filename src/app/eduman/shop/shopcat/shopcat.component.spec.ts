import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopcatComponent } from './shopcat.component';

describe('ShopcatComponent', () => {
  let component: ShopcatComponent;
  let fixture: ComponentFixture<ShopcatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShopcatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopcatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
