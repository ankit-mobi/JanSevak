import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShuttleForm } from './shuttle-form';

describe('ShuttleForm', () => {
  let component: ShuttleForm;
  let fixture: ComponentFixture<ShuttleForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShuttleForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShuttleForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
