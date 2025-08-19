import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoriteCoursesComponent } from './favorite-courses.component';

describe('FavoriteCoursesComponent', () => {
  let component: FavoriteCoursesComponent;
  let fixture: ComponentFixture<FavoriteCoursesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FavoriteCoursesComponent]
    });
    fixture = TestBed.createComponent(FavoriteCoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
