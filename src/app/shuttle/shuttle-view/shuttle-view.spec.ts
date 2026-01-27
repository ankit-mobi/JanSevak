import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShuttleView } from './shuttle-view';

describe('ShuttleView', () => {
  let component: ShuttleView;
  let fixture: ComponentFixture<ShuttleView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShuttleView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShuttleView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
