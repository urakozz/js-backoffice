/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MetrikaService } from './metrika.service';

describe('Service: Metrika', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MetrikaService]
    });
  });

  it('should ...', inject([MetrikaService], (service: MetrikaService) => {
    expect(service).toBeTruthy();
  }));
});
