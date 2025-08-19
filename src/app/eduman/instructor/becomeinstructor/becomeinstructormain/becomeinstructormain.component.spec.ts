import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BecomeinstructormainComponent } from './becomeinstructormain.component';

describe('BecomeinstructormainComponent', () => {
  let component: BecomeinstructormainComponent;
  let fixture: ComponentFixture<BecomeinstructormainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BecomeinstructormainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BecomeinstructormainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
