import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomethreemainComponent } from './homethreemain.component';

describe('HomethreemainComponent', () => {
  let component: HomethreemainComponent;
  let fixture: ComponentFixture<HomethreemainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomethreemainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomethreemainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
