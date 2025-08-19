import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HometwomainComponent } from './hometwomain.component';

describe('HometwomainComponent', () => {
  let component: HometwomainComponent;
  let fixture: ComponentFixture<HometwomainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HometwomainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HometwomainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
