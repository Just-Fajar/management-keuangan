import { describe, it, expect, beforeEach } from 'vitest';
import 'fake-indexeddb/auto';
import { FinanceDB } from '../../db/dexie';
import { DexieRepository } from '../../db/repositories/dexieRepository';

describe('Grey-box Integration Test: Transaction Deletion and Balance Rollback', () => {
  let testDb: FinanceDB;
  let repo: DexieRepository;

  beforeEach(async () => {
    testDb = new FinanceDB(`DeleteTestDB_${Math.random()}`);
    await testDb.open();
    await testDb.accounts.clear();
    await testDb.transactions.clear();
    repo = new DexieRepository(testDb);
  });

  it('should create an expense transaction, lower balance, and restore balance after deletion', async () => {
    const cash = await repo.createAccount({
      name: 'Cash',
      type: 'cash',
      initial_balance: 100000
    });

    const tx = await repo.createTransaction({
      account_id: cash.id,
      type: 'expense',
      amount: 25000,
      note: 'Makan Siang',
      date: new Date().toISOString()
    });

    // Balance after expense: 100000 - 25000 = 75000
    const balanceAfterTx = await repo.getAccountBalance(cash.id);
    expect(balanceAfterTx).toBe(75000);

    // Delete transaction
    await repo.deleteTransaction(tx.id);

    // Balance should rollback to initial 100000
    const balanceAfterDelete = await repo.getAccountBalance(cash.id);
    expect(balanceAfterDelete).toBe(100000);

    const remainingTxs = await repo.getTransactions();
    expect(remainingTxs).toHaveLength(0);
  });
});
