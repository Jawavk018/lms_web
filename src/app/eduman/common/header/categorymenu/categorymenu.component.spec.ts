import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategorymenuComponent } from './categorymenu.component';

describe('CategorymenuComponent', () => {
  let component: CategorymenuComponent;
  let fixture: ComponentFixture<CategorymenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CategorymenuComponent]
    });
    fixture = TestBed.createComponent(CategorymenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
