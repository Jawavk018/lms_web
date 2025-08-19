import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursetabComponent } from './coursetab.component';

describe('CoursetabComponent', () => {
  let component: CoursetabComponent;
  let fixture: ComponentFixture<CoursetabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoursetabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoursetabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
