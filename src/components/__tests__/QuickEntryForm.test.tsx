// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { QuickEntryForm } from '../QuickEntryForm';
import { Account, Category } from '../../types/database';

const dummyAccounts: Account[] = [
  { id: 'acc_1', name: 'Cash', type: 'cash', initial_balance: 100000 },
  { id: 'acc_2', name: 'BCA', type: 'bank', initial_balance: 500000 }
];

const dummyCategories: Category[] = [
  { id: 'cat_1', name: 'Makan & Minum', type: 'expense' },
  { id: 'cat_2', name: 'Gaji', type: 'income' }
];

describe('Black-box Test: QuickEntryForm Component UI', () => {
  afterEach(() => {
    cleanup();
  });

  it('should render form with default account and category selected', () => {
    render(
      <QuickEntryForm
        accounts={dummyAccounts}
        categories={dummyCategories}
        onSubmit={vi.fn()}
      />
    );

    expect(screen.getByText('Nominal Transaksi (Auto-Focus)')).toBeDefined();
    expect(screen.getByDisplayValue('Rp 0')).toBeDefined();
    expect(screen.getByDisplayValue('Cash (CASH)')).toBeDefined();
    expect(screen.getByDisplayValue('Makan & Minum')).toBeDefined();
  });

  it('should update amount display when numpad buttons are pressed', () => {
    render(
      <QuickEntryForm
        accounts={dummyAccounts}
        categories={dummyCategories}
        onSubmit={vi.fn()}
      />
    );

    // Press Numpad '1', '5', '000'
    fireEvent.click(screen.getAllByRole('button', { name: '1' })[0]);
    fireEvent.click(screen.getAllByRole('button', { name: '5' })[0]);
    fireEvent.click(screen.getAllByRole('button', { name: '000' })[0]);

    expect(screen.getByDisplayValue('Rp 15.000')).toBeDefined();
  });

  it('should call onSubmit with accurate transaction payload', async () => {
    const handleSubmit = vi.fn().mockResolvedValue(undefined);

    render(
      <QuickEntryForm
        accounts={dummyAccounts}
        categories={dummyCategories}
        onSubmit={handleSubmit}
      />
    );

    // Press Numpad '2', '0', '000' -> Rp 20.000
    fireEvent.click(screen.getAllByRole('button', { name: '2' })[0]);
    fireEvent.click(screen.getAllByRole('button', { name: '0' })[0]);
    fireEvent.click(screen.getAllByRole('button', { name: '000' })[0]);

    // Submit Form
    fireEvent.click(screen.getAllByRole('button', { name: 'Simpan Transaksi Instan' })[0]);

    expect(handleSubmit).toHaveBeenCalledTimes(1);
    expect(handleSubmit).toHaveBeenCalledWith({
      account_id: 'acc_1',
      category_id: 'cat_1',
      type: 'expense',
      amount: 20000,
      note: undefined
    });
  });
});
