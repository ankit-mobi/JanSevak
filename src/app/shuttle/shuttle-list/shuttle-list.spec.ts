import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShuttleList } from './shuttle-list';

describe('ShuttleList', () => {
  let component: ShuttleList;
  let fixture: ComponentFixture<ShuttleList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShuttleList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShuttleList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
