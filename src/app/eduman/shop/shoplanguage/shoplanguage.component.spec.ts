import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoplanguageComponent } from './shoplanguage.component';

describe('ShoplanguageComponent', () => {
  let component: ShoplanguageComponent;
  let fixture: ComponentFixture<ShoplanguageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShoplanguageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShoplanguageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
