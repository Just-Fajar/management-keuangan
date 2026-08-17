// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { DataBackupModal } from '../DataBackupModal';
import { Account, Category, Transaction, Preset } from '../../types/database';

const dummyAccounts: Account[] = [
  { id: 'acc_1', name: 'Cash', type: 'cash', initial_balance: 100000 }
];

const dummyCategories: Category[] = [
  { id: 'cat_1', name: 'Makan', type: 'expense', monthly_budget: 500000 }
];

const dummyTransactions: Transaction[] = [];
const dummyPresets: Preset[] = [];

describe('Black-box Test: DataBackupModal Component UI', () => {
  afterEach(() => {
    cleanup();
  });

  it('should render backup and restore modal elements correctly', () => {
    render(
      <DataBackupModal
        isOpen={true}
        onClose={vi.fn()}
        accounts={dummyAccounts}
        categories={dummyCategories}
        transactions={dummyTransactions}
        presets={dummyPresets}
        onDataRestored={vi.fn()}
      />
    );

    expect(screen.getByText('Cadangan & Portabilitas Data')).toBeDefined();
    expect(screen.getByText('Backup JSON')).toBeDefined();
    expect(screen.getByText('Ekspor Excel (CSV)')).toBeDefined();
    expect(screen.getByText('Pulihkan Data dari Cadangan (Restore)')).toBeDefined();
  });
});
