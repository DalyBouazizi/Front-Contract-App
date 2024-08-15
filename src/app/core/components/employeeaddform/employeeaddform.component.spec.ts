import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeaddformComponent } from './employeeaddform.component';

describe('EmployeeaddformComponent', () => {
  let component: EmployeeaddformComponent;
  let fixture: ComponentFixture<EmployeeaddformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmployeeaddformComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeaddformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
