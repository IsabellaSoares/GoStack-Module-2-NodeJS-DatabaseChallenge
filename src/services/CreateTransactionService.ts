import { getRepository, getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';

import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoriesRepository = getRepository(Category);

    const transactions = await transactionsRepository.find();
    const balance = await transactionsRepository.getBalance(transactions);

    if (type === 'outcome' && value > balance.total) {
      throw new AppError('Insufficient funds!', 400);
    }

    let findCategory = await categoriesRepository.findOne({
      where: { title: category },
    });

    if (!findCategory) {
      findCategory = categoriesRepository.create({
        title: category,
      });

      await categoriesRepository.save(findCategory);
    }

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id: findCategory.id,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
