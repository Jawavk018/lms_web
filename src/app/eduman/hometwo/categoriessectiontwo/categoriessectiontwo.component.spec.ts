import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriessectiontwoComponent } from './categoriessectiontwo.component';

describe('CategoriessectiontwoComponent', () => {
  let component: CategoriessectiontwoComponent;
  let fixture: ComponentFixture<CategoriessectiontwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategoriessectiontwoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoriessectiontwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
