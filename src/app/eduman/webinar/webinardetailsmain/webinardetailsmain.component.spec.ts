import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebinardetailsmainComponent } from './webinardetailsmain.component';

describe('WebinardetailsmainComponent', () => {
  let component: WebinardetailsmainComponent;
  let fixture: ComponentFixture<WebinardetailsmainComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WebinardetailsmainComponent]
    });
    fixture = TestBed.createComponent(WebinardetailsmainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
