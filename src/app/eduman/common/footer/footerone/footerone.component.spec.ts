import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooteroneComponent } from './footerone.component';

describe('FooteroneComponent', () => {
  let component: FooteroneComponent;
  let fixture: ComponentFixture<FooteroneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FooteroneComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FooteroneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
