import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoppriceComponent } from './shopprice.component';

describe('ShoppriceComponent', () => {
  let component: ShoppriceComponent;
  let fixture: ComponentFixture<ShoppriceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShoppriceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShoppriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
