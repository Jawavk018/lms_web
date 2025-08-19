import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogtagsComponent } from './blogtags.component';

describe('BlogtagsComponent', () => {
  let component: BlogtagsComponent;
  let fixture: ComponentFixture<BlogtagsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlogtagsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogtagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
