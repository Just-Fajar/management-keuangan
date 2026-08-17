// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { ReconcileModal } from '../ReconcileModal';
import { Account } from '../../types/database';

const dummyAccounts: Account[] = [
  { id: 'acc_1', name: 'Dompet Tunai', type: 'cash', initial_balance: 100000 }
];

const dummyBalances = {
  acc_1: 100000
};

describe('Black-box Test: ReconcileModal 1-Tap Adjust Saldo Component UI', () => {
  afterEach(() => {
    cleanup();
  });

  it('should render reconcile modal elements correctly', () => {
    render(
      <ReconcileModal
        isOpen={true}
        onClose={vi.fn()}
        accounts={dummyAccounts}
        accountBalances={dummyBalances}
        onReconcile={vi.fn()}
      />
    );

    expect(screen.getByText('1-Tap Reconcile (Adjust Saldo)')).toBeDefined();
    expect(screen.getByLabelText('Saldo Fisik Riil Saat Ini (Rupiah)')).toBeDefined();
  });

  it('should calculate difference in real-time and call onReconcile on submit', async () => {
    const handleReconcile = vi.fn().mockResolvedValue(undefined);

    render(
      <ReconcileModal
        isOpen={true}
        onClose={vi.fn()}
        accounts={dummyAccounts}
        accountBalances={dummyBalances}
        onReconcile={handleReconcile}
      />
    );

    // Input actual physical balance 95000 (diff = -5000)
    fireEvent.change(screen.getByLabelText('Saldo Fisik Riil Saat Ini (Rupiah)'), { target: { value: '95000' } });

    expect(screen.getByText('Penyesuaian Saldo Minus')).toBeDefined();
    expect(screen.getByText('-Rp 5.000')).toBeDefined();

    fireEvent.click(screen.getByRole('button', { name: 'Simpan Adjust Saldo Fisik' }));

    expect(handleReconcile).toHaveBeenCalledTimes(1);
    expect(handleReconcile).toHaveBeenCalledWith('acc_1', 95000, 'Penyesuaian Saldo Fisik');
  });
});
