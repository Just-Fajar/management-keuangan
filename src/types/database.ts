export type AccountType = 'cash' | 'bank' | 'ewallet';
export type CategoryType = 'expense' | 'income';
export type TransactionType = 'expense' | 'income' | 'transfer' | 'adjustment';

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  initial_balance: number; // INTEGER Rupiah
  color?: string;
}

export interface Category {
  id: string;
  name: string;
  type: CategoryType;
  monthly_budget?: number; // INTEGER Rupiah
  daily_budget?: number; // INTEGER Rupiah
}

export interface Transaction {
  id: string;
  account_id: string;
  target_account_id?: string; // Khusus transfer
  category_id?: string; // Kosong jika transfer / adjustment
  type: TransactionType;
  amount: number; // INTEGER Rupiah utuh
  note?: string;
  date: string; // ISO 8601 string (YYYY-MM-DDTHH:mm:ss.sssZ)
}

export interface Preset {
  id: string;
  title: string;
  account_id: string;
  category_id: string;
  amount: number; // INTEGER Rupiah
}

export type CreateAccountInput = Omit<Account, 'id'>;
export type CreateCategoryInput = Omit<Category, 'id'>;
export type CreateTransactionInput = Omit<Transaction, 'id' | 'date'> & { date?: string };
export type CreatePresetInput = Omit<Preset, 'id'>;
