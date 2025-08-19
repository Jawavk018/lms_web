import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppPasswordToggleComponent } from './app-password-toggle.component';

describe('AppPasswordToggleComponent', () => {
  let component: AppPasswordToggleComponent;
  let fixture: ComponentFixture<AppPasswordToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppPasswordToggleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AppPasswordToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
