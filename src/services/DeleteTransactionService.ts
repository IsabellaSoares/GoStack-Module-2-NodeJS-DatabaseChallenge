import { getRepository } from 'typeorm';

import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionsRepository = getRepository(Transaction);

    const checkTransactionExists = await transactionsRepository.findOne(id);

    if (!checkTransactionExists) {
      throw new AppError('This transaction does not exist.');
    }

    transactionsRepository.delete(id);
  }
}

export default DeleteTransactionService;
