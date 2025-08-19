import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HerosectiontwoComponent } from './herosectiontwo.component';

describe('HerosectiontwoComponent', () => {
  let component: HerosectiontwoComponent;
  let fixture: ComponentFixture<HerosectiontwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HerosectiontwoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HerosectiontwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
