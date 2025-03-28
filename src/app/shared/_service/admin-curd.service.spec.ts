import { TestBed } from '@angular/core/testing';

import { AdminCurdService } from './admin-curd.service';

describe('AdminCurdService', () => {
  let service: AdminCurdService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminCurdService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
