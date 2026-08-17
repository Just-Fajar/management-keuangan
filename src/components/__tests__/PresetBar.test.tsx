// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { PresetBar } from '../PresetBar';
import { Preset } from '../../types/database';

const dummyPresets: Preset[] = [
  { id: 'p_1', title: 'Kopi Pagi', account_id: 'acc_1', category_id: 'cat_1', amount: 15000 },
  { id: 'p_2', title: 'Bensin Motor', account_id: 'acc_1', category_id: 'cat_2', amount: 20000 }
];

describe('Black-box Test: PresetBar 1-Tap Entry Component', () => {
  afterEach(() => {
    cleanup();
  });

  it('should render preset buttons correctly', () => {
    render(
      <PresetBar
        presets={dummyPresets}
        onSelectPreset={vi.fn()}
        onOpenManageModal={vi.fn()}
      />
    );

    expect(screen.getByText('Pintasan 1-Tap Entry')).toBeDefined();
    expect(screen.getAllByText('Kopi Pagi').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Bensin Motor').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Rp 15.000').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Rp 20.000').length).toBeGreaterThan(0);
  });

  it('should open confirmation modal and trigger onSelectPreset when confirmed', () => {
    const handleSelectPreset = vi.fn().mockResolvedValue(undefined);

    render(
      <PresetBar
        presets={dummyPresets}
        onSelectPreset={handleSelectPreset}
        onOpenManageModal={vi.fn()}
      />
    );

    // Tap preset button
    fireEvent.click(screen.getAllByText('Kopi Pagi')[0]);

    // Check confirmation modal opens
    expect(screen.getByText('Konfirmasi 1-Tap Entry')).toBeDefined();

    // Click confirm button
    fireEvent.click(screen.getByRole('button', { name: /Ya, Catat Transaksi/i }));

    expect(handleSelectPreset).toHaveBeenCalledTimes(1);
    expect(handleSelectPreset).toHaveBeenCalledWith(dummyPresets[0]);
  });
});
