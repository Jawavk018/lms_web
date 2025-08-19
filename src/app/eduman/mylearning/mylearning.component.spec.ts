import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MylearningComponent } from './mylearning.component';

describe('MylearningComponent', () => {
  let component: MylearningComponent;
  let fixture: ComponentFixture<MylearningComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MylearningComponent]
    });
    fixture = TestBed.createComponent(MylearningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
