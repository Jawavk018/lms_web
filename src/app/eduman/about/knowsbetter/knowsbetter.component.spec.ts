import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KnowsbetterComponent } from './knowsbetter.component';

describe('KnowsbetterComponent', () => {
  let component: KnowsbetterComponent;
  let fixture: ComponentFixture<KnowsbetterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KnowsbetterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KnowsbetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
