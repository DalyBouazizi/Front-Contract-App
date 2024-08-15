import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeupdateformComponent } from './employeeupdateform.component';

describe('EmployeeupdateformComponent', () => {
  let component: EmployeeupdateformComponent;
  let fixture: ComponentFixture<EmployeeupdateformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmployeeupdateformComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeupdateformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
