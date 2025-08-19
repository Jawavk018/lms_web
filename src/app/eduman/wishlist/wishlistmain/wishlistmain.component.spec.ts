import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WishlistmainComponent } from './wishlistmain.component';

describe('WishlistmainComponent', () => {
  let component: WishlistmainComponent;
  let fixture: ComponentFixture<WishlistmainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WishlistmainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WishlistmainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
