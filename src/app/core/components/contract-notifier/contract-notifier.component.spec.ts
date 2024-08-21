import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractNotifierComponent } from './contract-notifier.component';

describe('ContractNotifierComponent', () => {
  let component: ContractNotifierComponent;
  let fixture: ComponentFixture<ContractNotifierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContractNotifierComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContractNotifierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
