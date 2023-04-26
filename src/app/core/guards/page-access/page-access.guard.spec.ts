import { TestBed } from '@angular/core/testing';

import { PageAccessGuard } from './page-access.guard';

describe('PageAccessGuard', () => {
  let guard: PageAccessGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(PageAccessGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
