import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampussectionComponent } from './campussection.component';

describe('CampussectionComponent', () => {
  let component: CampussectionComponent;
  let fixture: ComponentFixture<CampussectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CampussectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CampussectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
