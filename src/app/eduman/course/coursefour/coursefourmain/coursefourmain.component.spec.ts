import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursefourmainComponent } from './coursefourmain.component';

describe('CoursefourmainComponent', () => {
  let component: CoursefourmainComponent;
  let fixture: ComponentFixture<CoursefourmainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoursefourmainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoursefourmainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
