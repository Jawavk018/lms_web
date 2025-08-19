import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnersectionComponent } from './partnersection.component';

describe('PartnersectionComponent', () => {
  let component: PartnersectionComponent;
  let fixture: ComponentFixture<PartnersectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartnersectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnersectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
