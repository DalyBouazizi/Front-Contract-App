import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractsmanagementComponent } from './contractsmanagement.component';

describe('ContractsmanagementComponent', () => {
  let component: ContractsmanagementComponent;
  let fixture: ComponentFixture<ContractsmanagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContractsmanagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContractsmanagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
