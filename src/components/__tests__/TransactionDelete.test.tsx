// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import 'fake-indexeddb/auto';
import { FinanceDB } from '../../db/dexie';
import { DexieRepository } from '../../db/repositories/dexieRepository';
import { DeleteConfirmModal } from '../DeleteConfirmModal';
import { Account, Category, Transaction } from '../../types/database';

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

  afterEach(() => {
    cleanup();
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

  it('should render DeleteConfirmModal and trigger onConfirmDelete when confirmed', async () => {
    const dummyAccount: Account = { id: 'acc_1', name: 'Dompet Cash', type: 'cash', initial_balance: 100000 };
    const dummyCategory: Category = { id: 'cat_1', name: 'Makan & Minum', type: 'expense' };
    const dummyTx: Transaction = {
      id: 'tx_1',
      account_id: 'acc_1',
      category_id: 'cat_1',
      type: 'expense',
      amount: 25000,
      note: 'Kopi Siang',
      date: new Date().toISOString()
    };

    const handleConfirmDelete = vi.fn().mockResolvedValue(undefined);
    const handleClose = vi.fn();

    render(
      <DeleteConfirmModal
        isOpen={true}
        onClose={handleClose}
        transaction={dummyTx}
        accounts={[dummyAccount]}
        categories={[dummyCategory]}
        onConfirmDelete={handleConfirmDelete}
      />
    );

    expect(screen.getByText('Hapus Transaksi')).toBeDefined();
    expect(screen.getByText('Kopi Siang')).toBeDefined();
    expect(screen.getByText('Rp 25.000')).toBeDefined();

    // Click confirm delete button
    fireEvent.click(screen.getByRole('button', { name: /Ya, Hapus Transaksi/i }));

    expect(handleConfirmDelete).toHaveBeenCalledTimes(1);
    expect(handleConfirmDelete).toHaveBeenCalledWith('tx_1');
  });
});
