import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(transactions: Transaction[]): Promise<Balance> {
    const income = transactions
      .filter(transaction => transaction.type === 'income')
      .reduce((acc, current) => acc + current.value, 0);

    const outcome = transactions
      .filter(transaction => transaction.type === 'outcome')
      .reduce((acc, current) => acc + current.value, 0);

    return {
      income,
      outcome,
      total: income - outcome,
    };
  }
}

export default TransactionsRepository;
