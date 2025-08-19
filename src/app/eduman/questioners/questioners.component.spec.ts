import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionersComponent } from './questioners.component';

describe('QuestionersComponent', () => {
  let component: QuestionersComponent;
  let fixture: ComponentFixture<QuestionersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ QuestionersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuestionersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
