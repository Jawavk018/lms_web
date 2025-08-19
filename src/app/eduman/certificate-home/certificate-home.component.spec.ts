import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificateHomeComponent } from './certificate-home.component';

describe('CertificateHomeComponent', () => {
  let component: CertificateHomeComponent;
  let fixture: ComponentFixture<CertificateHomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CertificateHomeComponent]
    });
    fixture = TestBed.createComponent(CertificateHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
