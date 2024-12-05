import { TestBed } from '@angular/core/testing';

import { TicketpoolService } from './ticketpool.service';

describe('TicketpoolService', () => {
  let service: TicketpoolService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TicketpoolService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
