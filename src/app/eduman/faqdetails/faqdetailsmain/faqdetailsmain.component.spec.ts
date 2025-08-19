import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaqdetailsmainComponent } from './faqdetailsmain.component';

describe('FaqdetailsmainComponent', () => {
  let component: FaqdetailsmainComponent;
  let fixture: ComponentFixture<FaqdetailsmainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FaqdetailsmainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FaqdetailsmainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
