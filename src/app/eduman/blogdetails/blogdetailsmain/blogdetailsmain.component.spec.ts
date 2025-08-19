import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogdetailsmainComponent } from './blogdetailsmain.component';

describe('BlogdetailsmainComponent', () => {
  let component: BlogdetailsmainComponent;
  let fixture: ComponentFixture<BlogdetailsmainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlogdetailsmainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogdetailsmainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
