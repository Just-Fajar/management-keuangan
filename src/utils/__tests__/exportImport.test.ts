import { describe, it, expect, beforeEach } from 'vitest';
import 'fake-indexeddb/auto';
import { generateJSONBackup, generateTransactionsCSV, parseAndRestoreJSONBackup } from '../exportImport';
import { FinanceDB } from '../../db/dexie';
import { DexieRepository } from '../../db/repositories/dexieRepository';
import { Account, Category, Transaction, Preset } from '../../types/database';

const dummyAccounts: Account[] = [
  { id: 'acc_1', name: 'Cash', type: 'cash', initial_balance: 100000 }
];

const dummyCategories: Category[] = [
  { id: 'cat_1', name: 'Makan', type: 'expense', monthly_budget: 500000 }
];

const dummyTransactions: Transaction[] = [
  { id: 'tx_1', account_id: 'acc_1', category_id: 'cat_1', type: 'expense', amount: 15000, note: 'Kopi', date: '2026-08-17T07:00:00.000Z' }
];

const dummyPresets: Preset[] = [
  { id: 'p_1', title: 'Kopi Pagi', account_id: 'acc_1', category_id: 'cat_1', amount: 15000 }
];

describe('White-box Test: exportImport Utility Functions', () => {
  it('should generate valid JSON backup string', () => {
    const jsonStr = generateJSONBackup(dummyAccounts, dummyCategories, dummyTransactions, dummyPresets);
    expect(jsonStr).toBeDefined();

    const parsed = JSON.parse(jsonStr);
    expect(parsed.version).toBe(1);
    expect(parsed.accounts).toHaveLength(1);
    expect(parsed.transactions).toHaveLength(1);
    expect(parsed.presets).toHaveLength(1);
  });

  it('should generate valid CSV transactions string', () => {
    const csvStr = generateTransactionsCSV(dummyTransactions, dummyAccounts, dummyCategories);
    expect(csvStr).toBeDefined();
    expect(csvStr).toContain('ID,Tanggal,Tipe,Dompet,Target Dompet,Kategori,Nominal (Rp),Catatan');
    expect(csvStr).toContain('tx_1');
    expect(csvStr).toContain('"Cash"');
    expect(csvStr).toContain('"Makan"');
    expect(csvStr).toContain('15000');
  });
});

describe('Grey-box Integration Test: parseAndRestoreJSONBackup with DexieRepository', () => {
  let testDb: FinanceDB;
  let repo: DexieRepository;

  beforeEach(async () => {
    testDb = new FinanceDB(`RestoreTestDB_${Math.random()}`);
    await testDb.open();
    await testDb.accounts.clear();
    await testDb.categories.clear();
    await testDb.presets.clear();
    await testDb.transactions.clear();
    repo = new DexieRepository(testDb);
  });

  it('should restore data from JSON string into IndexedDB successfully', async () => {
    const jsonBackup = generateJSONBackup(dummyAccounts, dummyCategories, dummyTransactions, dummyPresets);

    const res = await parseAndRestoreJSONBackup(jsonBackup, repo);
    expect(res.transactionsCount).toBe(1);

    const accs = await repo.getAccounts();
    expect(accs).toHaveLength(1);
    expect(accs[0].name).toBe('Cash');

    const txs = await repo.getTransactions();
    expect(txs).toHaveLength(1);
    expect(txs[0].amount).toBe(15000);
  });
});
