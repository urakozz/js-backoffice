/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { BackendUserService } from './backend-user-service.service';

describe('Service: BackendUserService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BackendUserService]
    });
  });

  it('should ...', inject([BackendUserService], (service: BackendUserService) => {
    expect(service).toBeTruthy();
  }));
});
