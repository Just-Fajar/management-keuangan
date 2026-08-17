import {
  Account,
  Category,
  Transaction,
  Preset,
  CreateAccountInput,
  CreateCategoryInput,
  CreateTransactionInput,
  CreatePresetInput
} from '../../types/database';

export interface IDatabaseRepository {
  // Accounts
  getAccounts(): Promise<Account[]>;
  getAccountById(id: string): Promise<Account | undefined>;
  createAccount(input: CreateAccountInput): Promise<Account>;
  updateAccount(id: string, input: Partial<CreateAccountInput>): Promise<Account>;
  deleteAccount(id: string): Promise<void>;
  getAccountBalance(accountId: string): Promise<number>;
  getTotalCombinedBalance(): Promise<number>;

  // Categories
  getCategories(): Promise<Category[]>;
  getCategoryById(id: string): Promise<Category | undefined>;
  createCategory(input: CreateCategoryInput): Promise<Category>;
  updateCategory(id: string, input: Partial<CreateCategoryInput>): Promise<Category>;
  deleteCategory(id: string): Promise<void>;

  // Transactions
  getTransactions(): Promise<Transaction[]>;
  getTransactionById(id: string): Promise<Transaction | undefined>;
  createTransaction(input: CreateTransactionInput): Promise<Transaction>;
  createTransfer(
    fromAccountId: string,
    toAccountId: string,
    amount: number,
    note?: string,
    date?: string
  ): Promise<Transaction>;
  reconcileAccountBalance(
    accountId: string,
    actualPhysicalBalance: number,
    note?: string,
    date?: string
  ): Promise<Transaction | null>;
  deleteTransaction(id: string): Promise<void>;

  // Presets
  getPresets(): Promise<Preset[]>;
  getPresetById(id: string): Promise<Preset | undefined>;
  createPreset(input: CreatePresetInput): Promise<Preset>;
  updatePreset(id: string, input: Partial<CreatePresetInput>): Promise<Preset>;
  deletePreset(id: string): Promise<void>;
}
