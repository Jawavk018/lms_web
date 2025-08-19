import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactmainComponent } from './contactmain.component';

describe('ContactmainComponent', () => {
  let component: ContactmainComponent;
  let fixture: ComponentFixture<ContactmainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactmainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactmainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
