import Dexie, { Table } from 'dexie';
import { Account, Category, Transaction, Preset } from '../types/database';

export class FinanceDB extends Dexie {
  accounts!: Table<Account, string>;
  categories!: Table<Category, string>;
  transactions!: Table<Transaction, string>;
  presets!: Table<Preset, string>;

  constructor(dbName: string = 'ManagementKeuanganDB') {
    super(dbName);
    this.version(1).stores({
      accounts: 'id, name, type',
      categories: 'id, name, type',
      transactions: 'id, account_id, target_account_id, category_id, type, date',
      presets: 'id, title'
    });

    // Populate initial default data ONLY ONCE when database is created
    this.on('populate', (tx) => {
      // Default Accounts with Indonesian E-Wallets
      tx.table('accounts').bulkAdd([
        { id: 'acc_cash', name: 'Dompet Tunai', type: 'cash', initial_balance: 100000, color: '#10B981' },
        { id: 'acc_bank', name: 'Bank Utama (BCA)', type: 'bank', initial_balance: 500000, color: '#3B82F6' },
        { id: 'acc_gopay', name: 'GoPay', type: 'ewallet', initial_balance: 50000, color: '#00AED6' },
        { id: 'acc_dana', name: 'DANA', type: 'ewallet', initial_balance: 50000, color: '#118EEA' },
        { id: 'acc_ovo', name: 'OVO', type: 'ewallet', initial_balance: 25000, color: '#4C2A86' },
        { id: 'acc_shopeepay', name: 'ShopeePay', type: 'ewallet', initial_balance: 25000, color: '#EE4D2D' }
      ]);

      // Default Categories
      tx.table('categories').bulkAdd([
        { id: 'cat_makan', name: 'Makan & Minum', type: 'expense', monthly_budget: 1500000 },
        { id: 'cat_bensin', name: 'Bensin & Transport', type: 'expense', monthly_budget: 300000 },
        { id: 'cat_belanja', name: 'Belanja Harian', type: 'expense', monthly_budget: 500000 },
        { id: 'cat_hiburan', name: 'Hiburan & Hobi', type: 'expense', monthly_budget: 300000 },
        { id: 'cat_gaji', name: 'Gaji & Utama', type: 'income' },
        { id: 'cat_freelance', name: 'Bonus & Sampingan', type: 'income' }
      ]);

      // Default Presets
      tx.table('presets').bulkAdd([
        { id: 'p_kopi', title: 'Kopi Pagi', account_id: 'acc_cash', category_id: 'cat_makan', amount: 15000 },
        { id: 'p_bensin', title: 'Bensin Motor', account_id: 'acc_cash', category_id: 'cat_bensin', amount: 20000 }
      ]);
    });
  }
}

export const db = new FinanceDB();
