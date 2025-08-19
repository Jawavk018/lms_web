import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopdurationComponent } from './shopduration.component';

describe('ShopdurationComponent', () => {
  let component: ShopdurationComponent;
  let fixture: ComponentFixture<ShopdurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShopdurationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopdurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
