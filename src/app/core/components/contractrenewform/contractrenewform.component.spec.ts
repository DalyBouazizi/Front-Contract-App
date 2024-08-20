import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractrenewformComponent } from './contractrenewform.component';

describe('ContractrenewformComponent', () => {
  let component: ContractrenewformComponent;
  let fixture: ComponentFixture<ContractrenewformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContractrenewformComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContractrenewformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
