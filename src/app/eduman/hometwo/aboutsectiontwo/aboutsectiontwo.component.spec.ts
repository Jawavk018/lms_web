import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutsectiontwoComponent } from './aboutsectiontwo.component';

describe('AboutsectiontwoComponent', () => {
  let component: AboutsectiontwoComponent;
  let fixture: ComponentFixture<AboutsectiontwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AboutsectiontwoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutsectiontwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
