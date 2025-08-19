import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaqbannerComponent } from './faqbanner.component';

describe('FaqbannerComponent', () => {
  let component: FaqbannerComponent;
  let fixture: ComponentFixture<FaqbannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FaqbannerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FaqbannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
