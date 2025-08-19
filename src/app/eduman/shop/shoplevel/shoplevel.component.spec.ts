import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoplevelComponent } from './shoplevel.component';

describe('ShoplevelComponent', () => {
  let component: ShoplevelComponent;
  let fixture: ComponentFixture<ShoplevelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShoplevelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShoplevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
