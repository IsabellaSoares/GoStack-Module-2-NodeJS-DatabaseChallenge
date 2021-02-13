import { EntityRepository, Repository, getCustomRepository } from 'typeorm';

import Transaction from '../models/Transaction';
import TransactionsRepository from './TransactionsRepository';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const incomeArray = await transactionsRepository.find({
      where: { type: 'income' },
    });

    const income = incomeArray.reduce((acc, current) => acc + current.value, 0);

    const outcomeArray = await transactionsRepository.find({
      where: { type: 'outcome' },
    });

    const outcome = outcomeArray.reduce(
      (acc, current) => acc + current.value,
      0,
    );

    return {
      income,
      outcome,
      total: income - outcome,
    };
  }
}

export default TransactionsRepository;
