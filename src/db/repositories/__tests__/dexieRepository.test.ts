import { describe, it, expect, beforeEach } from 'vitest';
import 'fake-indexeddb/auto';
import { FinanceDB } from '../../dexie';
import { DexieRepository } from '../dexieRepository';

describe('Grey-box Integration Test: DexieRepository & IndexedDB', () => {
  let testDb: FinanceDB;
  let repo: DexieRepository;

  beforeEach(async () => {
    // Unique in-memory database name per test
    testDb = new FinanceDB(`TestDB_${Math.random()}`);
    await testDb.open();
    repo = new DexieRepository(testDb);
  });

  it('should create and retrieve accounts', async () => {
    const account = await repo.createAccount({
      name: 'Cash',
      type: 'cash',
      initial_balance: 100000,
      color: '#10B981'
    });

    expect(account.id).toBeDefined();
    expect(account.name).toBe('Cash');
    expect(account.initial_balance).toBe(100000);

    const accounts = await repo.getAccounts();
    expect(accounts).toHaveLength(1);
    expect(accounts[0].name).toBe('Cash');
  });

  it('should calculate account balance accurately with income, expense, and transfer', async () => {
    const cash = await repo.createAccount({
      name: 'Cash',
      type: 'cash',
      initial_balance: 50000
    });

    const bank = await repo.createAccount({
      name: 'Bank BCA',
      type: 'bank',
      initial_balance: 200000
    });

    // Add Income to Cash
    await repo.createTransaction({
      account_id: cash.id,
      type: 'income',
      amount: 30000,
      note: 'Uang Jajan',
      date: new Date().toISOString()
    });

    // Add Expense to Cash
    await repo.createTransaction({
      account_id: cash.id,
      type: 'expense',
      amount: 15000,
      note: 'Kopi',
      date: new Date().toISOString()
    });

    // Transfer from Bank to Cash: 50,000
    await repo.createTransfer(bank.id, cash.id, 50000, 'Tarik Tunai BCA');

    // Expected Cash Balance: 50,000 (initial) + 30,000 (income) - 15,000 (expense) + 50,000 (transfer in) = 115,000
    const cashBalance = await repo.getAccountBalance(cash.id);
    expect(cashBalance).toBe(115000);

    // Expected Bank Balance: 200,000 (initial) - 50,000 (transfer out) = 150,000
    const bankBalance = await repo.getAccountBalance(bank.id);
    expect(bankBalance).toBe(150000);

    // Total Combined Balance: 115,000 + 150,000 = 265,000
    const totalBalance = await repo.getTotalCombinedBalance();
    expect(totalBalance).toBe(265000);
  });

  it('should perform 1-Tap Reconcile (Adjust Saldo) correctly', async () => {
    const wallet = await repo.createAccount({
      name: 'Dompet Tunai',
      type: 'cash',
      initial_balance: 100000
    });

    // System balance is 100,000. Physical balance is actual 95,000 (-5,000 diff)
    const adjustmentTx = await repo.reconcileAccountBalance(wallet.id, 95000, 'Penyesuaian Fisik Tunai');

    expect(adjustmentTx).not.toBeNull();
    expect(adjustmentTx?.type).toBe('adjustment');
    expect(adjustmentTx?.amount).toBe(-5000);

    // New System Balance should equal actual physical balance (95,000)
    const newBalance = await repo.getAccountBalance(wallet.id);
    expect(newBalance).toBe(95000);
  });

  it('should CRUD presets correctly', async () => {
    const account = await repo.createAccount({ name: 'Cash', type: 'cash', initial_balance: 0 });
    const category = await repo.createCategory({ name: 'Makan', type: 'expense' });

    const preset = await repo.createPreset({
      title: 'Kopi Pagi',
      account_id: account.id,
      category_id: category.id,
      amount: 15000
    });

    expect(preset.id).toBeDefined();
    expect(preset.title).toBe('Kopi Pagi');

    const presets = await repo.getPresets();
    expect(presets).toHaveLength(1);
  });
});
