// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { TransferModal } from '../TransferModal';
import { Account } from '../../types/database';

const dummyAccounts: Account[] = [
  { id: 'acc_1', name: 'Cash', type: 'cash', initial_balance: 100000 },
  { id: 'acc_2', name: 'BCA', type: 'bank', initial_balance: 500000 }
];

const dummyBalances = {
  acc_1: 100000,
  acc_2: 500000
};

describe('Black-box Test: TransferModal Component UI', () => {
  afterEach(() => {
    cleanup();
  });

  it('should render transfer modal elements correctly', () => {
    render(
      <TransferModal
        isOpen={true}
        onClose={vi.fn()}
        accounts={dummyAccounts}
        accountBalances={dummyBalances}
        onTransfer={vi.fn()}
      />
    );

    expect(screen.getByText('Transfer Manual Antar Dompet')).toBeDefined();
    expect(screen.getByLabelText('Dompet Asal (Pindah Dari)')).toBeDefined();
    expect(screen.getByLabelText('Dompet Tujuan (Ke Dompet)')).toBeDefined();
  });

  it('should call onTransfer with correct parameters on submit', async () => {
    const handleTransfer = vi.fn().mockResolvedValue(undefined);

    render(
      <TransferModal
        isOpen={true}
        onClose={vi.fn()}
        accounts={dummyAccounts}
        accountBalances={dummyBalances}
        onTransfer={handleTransfer}
      />
    );

    fireEvent.change(screen.getByLabelText('Nominal Transfer (Rupiah)'), { target: { value: '50000' } });
    fireEvent.click(screen.getByRole('button', { name: 'Proses Transfer Manual' }));

    expect(handleTransfer).toHaveBeenCalledTimes(1);
    expect(handleTransfer).toHaveBeenCalledWith('acc_1', 'acc_2', 50000, undefined);
  });
});
