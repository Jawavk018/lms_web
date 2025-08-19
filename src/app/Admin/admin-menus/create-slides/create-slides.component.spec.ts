import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSlidesComponent } from './create-slides.component';

describe('CreateSlidesComponent', () => {
  let component: CreateSlidesComponent;
  let fixture: ComponentFixture<CreateSlidesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateSlidesComponent]
    });
    fixture = TestBed.createComponent(CreateSlidesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
