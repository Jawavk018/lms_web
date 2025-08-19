import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebinarvideopopupComponent } from './webinarvideopopup.component';

describe('WebinarvideopopupComponent', () => {
  let component: WebinarvideopopupComponent;
  let fixture: ComponentFixture<WebinarvideopopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WebinarvideopopupComponent]
    });
    fixture = TestBed.createComponent(WebinarvideopopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
