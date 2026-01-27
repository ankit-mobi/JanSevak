import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventView } from './event-view';

describe('EventView', () => {
  let component: EventView;
  let fixture: ComponentFixture<EventView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
