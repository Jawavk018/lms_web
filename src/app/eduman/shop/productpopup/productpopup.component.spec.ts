import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductpopupComponent } from './productpopup.component';

describe('ProductpopupComponent', () => {
  let component: ProductpopupComponent;
  let fixture: ComponentFixture<ProductpopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductpopupComponent]
    });
    fixture = TestBed.createComponent(ProductpopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
