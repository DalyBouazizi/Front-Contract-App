import { TestBed } from '@angular/core/testing';

import { NavigationStateServiceService } from './navigation-state-service.service';

describe('NavigationStateServiceService', () => {
  let service: NavigationStateServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NavigationStateServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
