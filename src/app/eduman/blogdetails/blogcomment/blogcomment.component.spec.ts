import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogcommentComponent } from './blogcomment.component';

describe('BlogcommentComponent', () => {
  let component: BlogcommentComponent;
  let fixture: ComponentFixture<BlogcommentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlogcommentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogcommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
