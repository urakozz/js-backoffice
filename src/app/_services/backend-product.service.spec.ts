/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { BackendProductService } from './backend-product.service';

describe('Service: BackendProduct', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BackendProductService]
    });
  });

  it('should ...', inject([BackendProductService], (service: BackendProductService) => {
    expect(service).toBeTruthy();
  }));
});
