import { BorrowingRepository } from '../repositories/borrowing.repository';

export class DashboardService {
  constructor(private borrowingRepo: BorrowingRepository) {}
}
