import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopratingComponent } from './shoprating.component';

describe('ShopratingComponent', () => {
  let component: ShopratingComponent;
  let fixture: ComponentFixture<ShopratingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShopratingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopratingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
