import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UseraddformComponent } from './useraddform.component';

describe('UseraddformComponent', () => {
  let component: UseraddformComponent;
  let fixture: ComponentFixture<UseraddformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UseraddformComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UseraddformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
