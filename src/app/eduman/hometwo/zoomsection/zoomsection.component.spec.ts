import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZoomsectionComponent } from './zoomsection.component';

describe('ZoomsectionComponent', () => {
  let component: ZoomsectionComponent;
  let fixture: ComponentFixture<ZoomsectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZoomsectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ZoomsectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
