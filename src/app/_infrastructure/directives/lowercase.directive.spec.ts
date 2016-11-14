/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { LowercaseDirective } from './lowercase.directive';
import {ElementRef} from "@angular/core";

describe('Directive: Lowercase', () => {
  it('should create an instance', () => {
    let directive = new LowercaseDirective(new ElementRef("a"));
    expect(directive).toBeTruthy();
  });
});
