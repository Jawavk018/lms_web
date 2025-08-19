import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainerDialogModelComponent } from './trainer-dialog-model.component';

describe('TrainerDialogModelComponent', () => {
  let component: TrainerDialogModelComponent;
  let fixture: ComponentFixture<TrainerDialogModelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrainerDialogModelComponent]
    });
    fixture = TestBed.createComponent(TrainerDialogModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
