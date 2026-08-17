import Dexie, { Table } from 'dexie';
import { Account, Category, Transaction, Preset } from '../types/database';

export class FinanceDB extends Dexie {
  accounts!: Table<Account, string>;
  categories!: Table<Category, string>;
  transactions!: Table<Transaction, string>;
  presets!: Table<Preset, string>;

  constructor(databaseName: string = 'FinanceDB') {
    super(databaseName);
    this.version(1).stores({
      accounts: 'id, name, type',
      categories: 'id, name, type',
      transactions: 'id, account_id, target_account_id, category_id, type, date',
      presets: 'id, title'
    });
  }
}

export const db = new FinanceDB();
