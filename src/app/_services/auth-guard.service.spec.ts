/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AdminAuthGuardService } from './auth-guard.service';

describe('Service: Auth', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AdminAuthGuardService]
    });
  });

  it('should ...', inject([AdminAuthGuardService], (service: AdminAuthGuardService) => {
    expect(service).toBeTruthy();
  }));
});
