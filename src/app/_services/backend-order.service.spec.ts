/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { BackendOrderService } from './backend-order.service';

describe('Service: BackendOrder', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BackendOrderService]
    });
  });

  it('should ...', inject([BackendOrderService], (service: BackendOrderService) => {
    expect(service).toBeTruthy();
  }));
});
