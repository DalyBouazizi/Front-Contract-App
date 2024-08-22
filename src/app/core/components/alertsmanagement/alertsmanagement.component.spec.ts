import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertsmanagementComponent } from './alertsmanagement.component';

describe('AlertsmanagementComponent', () => {
  let component: AlertsmanagementComponent;
  let fixture: ComponentFixture<AlertsmanagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AlertsmanagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlertsmanagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
