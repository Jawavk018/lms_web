import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreferncesComponent } from './prefernces.component';

describe('PreferncesComponent', () => {
  let component: PreferncesComponent;
  let fixture: ComponentFixture<PreferncesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PreferncesComponent]
    });
    fixture = TestBed.createComponent(PreferncesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
