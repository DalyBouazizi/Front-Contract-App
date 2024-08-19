import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractaddformComponent } from './contractaddform.component';

describe('ContractaddformComponent', () => {
  let component: ContractaddformComponent;
  let fixture: ComponentFixture<ContractaddformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContractaddformComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContractaddformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
