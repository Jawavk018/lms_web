import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KnowledgesectionComponent } from './knowledgesection.component';

describe('KnowledgesectionComponent', () => {
  let component: KnowledgesectionComponent;
  let fixture: ComponentFixture<KnowledgesectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KnowledgesectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KnowledgesectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
