import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractupdateformComponent } from './contractupdateform.component';

describe('ContractupdateformComponent', () => {
  let component: ContractupdateformComponent;
  let fixture: ComponentFixture<ContractupdateformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContractupdateformComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContractupdateformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
