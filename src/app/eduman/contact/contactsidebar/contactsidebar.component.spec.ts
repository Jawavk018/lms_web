import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactsidebarComponent } from './contactsidebar.component';

describe('ContactsidebarComponent', () => {
  let component: ContactsidebarComponent;
  let fixture: ComponentFixture<ContactsidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactsidebarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactsidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
