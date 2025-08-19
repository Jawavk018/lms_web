import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutfeatureComponent } from './aboutfeature.component';

describe('AboutfeatureComponent', () => {
  let component: AboutfeatureComponent;
  let fixture: ComponentFixture<AboutfeatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AboutfeatureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutfeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
