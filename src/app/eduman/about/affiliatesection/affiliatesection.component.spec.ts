import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AffiliatesectionComponent } from './affiliatesection.component';

describe('AffiliatesectionComponent', () => {
  let component: AffiliatesectionComponent;
  let fixture: ComponentFixture<AffiliatesectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AffiliatesectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AffiliatesectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
