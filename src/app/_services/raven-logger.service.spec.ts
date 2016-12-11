/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { RavenLoggerService } from './raven-logger.service';

describe('RavenLoggerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RavenLoggerService]
    });
  });

  it('should ...', inject([RavenLoggerService], (service: RavenLoggerService) => {
    expect(service).toBeTruthy();
  }));
});
