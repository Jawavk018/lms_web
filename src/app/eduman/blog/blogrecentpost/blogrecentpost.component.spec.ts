import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogrecentpostComponent } from './blogrecentpost.component';

describe('BlogrecentpostComponent', () => {
  let component: BlogrecentpostComponent;
  let fixture: ComponentFixture<BlogrecentpostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlogrecentpostComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogrecentpostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
