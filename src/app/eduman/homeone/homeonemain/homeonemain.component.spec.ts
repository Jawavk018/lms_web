import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeonemainComponent } from './homeonemain.component';

describe('HomeonemainComponent', () => {
  let component: HomeonemainComponent;
  let fixture: ComponentFixture<HomeonemainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeonemainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeonemainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
