import { FinanceDB } from '../dexie';
import { IDatabaseRepository } from './types';
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

export class DexieRepository implements IDatabaseRepository {
  private db: FinanceDB;

  constructor(customDb?: FinanceDB) {
    this.db = customDb || new FinanceDB();
  }

  private generateId(): string {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return 'id_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
  }

  // --- ACCOUNTS ---

  async getAccounts(): Promise<Account[]> {
    return await this.db.accounts.toArray();
  }

  async getAccountById(id: string): Promise<Account | undefined> {
    return await this.db.accounts.get(id);
  }

  async createAccount(input: CreateAccountInput): Promise<Account> {
    const account: Account = {
      ...input,
      id: this.generateId(),
      initial_balance: Math.round(input.initial_balance) // Ensure INTEGER
    };
    await this.db.accounts.add(account);
    return account;
  }

  async updateAccount(id: string, input: Partial<CreateAccountInput>): Promise<Account> {
    const existing = await this.getAccountById(id);
    if (!existing) {
      throw new Error(`Account with id ${id} not found`);
    }
    const updated: Account = {
      ...existing,
      ...input,
      initial_balance: input.initial_balance !== undefined ? Math.round(input.initial_balance) : existing.initial_balance
    };
    await this.db.accounts.put(updated);
    return updated;
  }

  async deleteAccount(id: string): Promise<void> {
    await this.db.accounts.delete(id);
  }

  async getAccountBalance(accountId: string): Promise<number> {
    const account = await this.getAccountById(accountId);
    if (!account) {
      return 0;
    }

    let balance = Math.round(account.initial_balance);

    const txs = await this.db.transactions.toArray();
    for (const tx of txs) {
      const amount = Math.round(tx.amount);
      if (tx.account_id === accountId) {
        if (tx.type === 'income') {
          balance += amount;
        } else if (tx.type === 'expense') {
          balance -= amount;
        } else if (tx.type === 'transfer') {
          balance -= amount; // Money transferred out
        } else if (tx.type === 'adjustment') {
          balance += amount; // Signed adjustment (+ or -)
        }
      } else if (tx.target_account_id === accountId && tx.type === 'transfer') {
        balance += amount; // Money transferred in
      }
    }

    return balance;
  }

  async getTotalCombinedBalance(): Promise<number> {
    const accounts = await this.getAccounts();
    let total = 0;
    for (const acc of accounts) {
      total += await this.getAccountBalance(acc.id);
    }
    return total;
  }

  // --- CATEGORIES ---

  async getCategories(): Promise<Category[]> {
    return await this.db.categories.toArray();
  }

  async getCategoryById(id: string): Promise<Category | undefined> {
    return await this.db.categories.get(id);
  }

  async createCategory(input: CreateCategoryInput): Promise<Category> {
    const category: Category = {
      ...input,
      id: this.generateId(),
      monthly_budget: input.monthly_budget !== undefined ? Math.round(input.monthly_budget) : undefined,
      daily_budget: input.daily_budget !== undefined ? Math.round(input.daily_budget) : undefined
    };
    await this.db.categories.add(category);
    return category;
  }

  async updateCategory(id: string, input: Partial<CreateCategoryInput>): Promise<Category> {
    const existing = await this.getCategoryById(id);
    if (!existing) {
      throw new Error(`Category with id ${id} not found`);
    }
    const updated: Category = {
      ...existing,
      ...input,
      monthly_budget: input.monthly_budget !== undefined ? Math.round(input.monthly_budget) : existing.monthly_budget,
      daily_budget: input.daily_budget !== undefined ? Math.round(input.daily_budget) : existing.daily_budget
    };
    await this.db.categories.put(updated);
    return updated;
  }

  async deleteCategory(id: string): Promise<void> {
    await this.db.categories.delete(id);
  }

  // --- TRANSACTIONS ---

  async getTransactions(): Promise<Transaction[]> {
    return await this.db.transactions.orderBy('date').reverse().toArray();
  }

  async getTransactionById(id: string): Promise<Transaction | undefined> {
    return await this.db.transactions.get(id);
  }

  async createTransaction(input: CreateTransactionInput): Promise<Transaction> {
    const tx: Transaction = {
      ...input,
      id: this.generateId(),
      amount: Math.round(input.amount), // Ensure INTEGER
      date: input.date || new Date().toISOString()
    };
    await this.db.transactions.add(tx);
    return tx;
  }

  async createTransfer(
    fromAccountId: string,
    toAccountId: string,
    amount: number,
    note?: string,
    date?: string
  ): Promise<Transaction> {
    return await this.createTransaction({
      account_id: fromAccountId,
      target_account_id: toAccountId,
      type: 'transfer',
      amount: Math.round(amount),
      note: note || 'Transfer antar dompet',
      date: date || new Date().toISOString()
    });
  }

  async reconcileAccountBalance(
    accountId: string,
    actualPhysicalBalance: number,
    note?: string,
    date?: string
  ): Promise<Transaction | null> {
    const currentSystemBalance = await this.getAccountBalance(accountId);
    const diff = Math.round(actualPhysicalBalance) - currentSystemBalance;

    if (diff === 0) {
      return null; // Saldo sudah sesuai
    }

    return await this.createTransaction({
      account_id: accountId,
      type: 'adjustment',
      amount: diff, // Signed diff: positive if physical > system, negative if physical < system
      note: note || 'Penyesuaian Saldo Fisik',
      date: date || new Date().toISOString()
    });
  }

  async deleteTransaction(id: string): Promise<void> {
    await this.db.transactions.delete(id);
  }

  // --- PRESETS ---

  async getPresets(): Promise<Preset[]> {
    return await this.db.presets.toArray();
  }

  async getPresetById(id: string): Promise<Preset | undefined> {
    return await this.db.presets.get(id);
  }

  async createPreset(input: CreatePresetInput): Promise<Preset> {
    const preset: Preset = {
      ...input,
      id: this.generateId(),
      amount: Math.round(input.amount)
    };
    await this.db.presets.add(preset);
    return preset;
  }

  async updatePreset(id: string, input: Partial<CreatePresetInput>): Promise<Preset> {
    const existing = await this.getPresetById(id);
    if (!existing) {
      throw new Error(`Preset with id ${id} not found`);
    }
    const updated: Preset = {
      ...existing,
      ...input,
      amount: input.amount !== undefined ? Math.round(input.amount) : existing.amount
    };
    await this.db.presets.put(updated);
    return updated;
  }

  async deletePreset(id: string): Promise<void> {
    await this.db.presets.delete(id);
  }
}
