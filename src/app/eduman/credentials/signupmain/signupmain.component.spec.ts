import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupmainComponent } from './signupmain.component';

describe('SignupmainComponent', () => {
  let component: SignupmainComponent;
  let fixture: ComponentFixture<SignupmainComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SignupmainComponent]
    });
    fixture = TestBed.createComponent(SignupmainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
