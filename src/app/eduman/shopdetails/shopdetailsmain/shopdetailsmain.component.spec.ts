import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopdetailsmainComponent } from './shopdetailsmain.component';

describe('ShopdetailsmainComponent', () => {
  let component: ShopdetailsmainComponent;
  let fixture: ComponentFixture<ShopdetailsmainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShopdetailsmainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopdetailsmainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
