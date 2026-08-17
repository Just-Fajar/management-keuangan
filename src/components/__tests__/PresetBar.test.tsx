// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PresetBar } from '../PresetBar';
import { Preset } from '../../types/database';

const dummyPresets: Preset[] = [
  { id: 'p_1', title: 'Kopi Pagi', account_id: 'acc_1', category_id: 'cat_1', amount: 15000 },
  { id: 'p_2', title: 'Bensin Motor', account_id: 'acc_1', category_id: 'cat_2', amount: 20000 }
];

describe('Black-box Test: PresetBar 1-Tap Entry Component', () => {
  it('should render preset buttons correctly', () => {
    render(
      <PresetBar
        presets={dummyPresets}
        onSelectPreset={vi.fn()}
        onOpenManageModal={vi.fn()}
      />
    );

    expect(screen.getByText('Pintasan 1-Tap Entry')).toBeDefined();
    expect(screen.getByText('Kopi Pagi')).toBeDefined();
    expect(screen.getByText('Bensin Motor')).toBeDefined();
    expect(screen.getByText('Rp 15.000')).toBeDefined();
    expect(screen.getByText('Rp 20.000')).toBeDefined();
  });

  it('should trigger onSelectPreset immediately when preset button is tapped', () => {
    const handleSelectPreset = vi.fn().mockResolvedValue(undefined);

    render(
      <PresetBar
        presets={dummyPresets}
        onSelectPreset={handleSelectPreset}
        onOpenManageModal={vi.fn()}
      />
    );

    fireEvent.click(screen.getByText('Kopi Pagi'));

    expect(handleSelectPreset).toHaveBeenCalledTimes(1);
    expect(handleSelectPreset).toHaveBeenCalledWith(dummyPresets[0]);
  });
});
