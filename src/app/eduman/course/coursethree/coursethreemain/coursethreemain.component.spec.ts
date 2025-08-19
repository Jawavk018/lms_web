import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursethreemainComponent } from './coursethreemain.component';

describe('CoursethreemainComponent', () => {
  let component: CoursethreemainComponent;
  let fixture: ComponentFixture<CoursethreemainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoursethreemainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoursethreemainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
