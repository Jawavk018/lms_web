import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MembershipsectionComponent } from './membershipsection.component';

describe('MembershipsectionComponent', () => {
  let component: MembershipsectionComponent;
  let fixture: ComponentFixture<MembershipsectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MembershipsectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MembershipsectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
