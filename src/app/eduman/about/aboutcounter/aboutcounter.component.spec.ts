import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutcounterComponent } from './aboutcounter.component';

describe('AboutcounterComponent', () => {
  let component: AboutcounterComponent;
  let fixture: ComponentFixture<AboutcounterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AboutcounterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutcounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
