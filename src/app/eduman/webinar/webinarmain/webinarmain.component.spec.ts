import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebinarmainComponent } from './webinarmain.component';

describe('WebinarmainComponent', () => {
  let component: WebinarmainComponent;
  let fixture: ComponentFixture<WebinarmainComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WebinarmainComponent]
    });
    fixture = TestBed.createComponent(WebinarmainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
