import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationHeaderComponent } from './organization-header.component';

describe('OrganizationHeaderComponent', () => {
  let component: OrganizationHeaderComponent;
  let fixture: ComponentFixture<OrganizationHeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrganizationHeaderComponent]
    });
    fixture = TestBed.createComponent(OrganizationHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
