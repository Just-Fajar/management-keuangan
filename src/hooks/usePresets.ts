import { useState, useEffect, useCallback } from 'react';
import { Preset, CreatePresetInput } from '../types/database';
import { DexieRepository } from '../db/repositories/dexieRepository';

const repo = new DexieRepository();

export function usePresets(defaultAccountId?: string, defaultCategoryId?: string) {
  const [presets, setPresets] = useState<Preset[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchPresets = useCallback(async () => {
    setLoading(true);
    try {
      let data = await repo.getPresets();
      // Seed default 1-tap presets if empty and default ids provided
      if (data.length === 0 && defaultAccountId && defaultCategoryId) {
        const presetKopi = await repo.createPreset({
          title: 'Kopi Rp 15.000',
          account_id: defaultAccountId,
          category_id: defaultCategoryId,
          amount: 15000
        });
        const presetBensin = await repo.createPreset({
          title: 'Bensin Rp 20.000',
          account_id: defaultAccountId,
          category_id: defaultCategoryId,
          amount: 20000
        });
        data = [presetKopi, presetBensin];
      }
      setPresets(data);
    } finally {
      setLoading(false);
    }
  }, [defaultAccountId, defaultCategoryId]);

  useEffect(() => {
    fetchPresets();
  }, [fetchPresets]);

  const addPreset = async (input: CreatePresetInput) => {
    const newPreset = await repo.createPreset(input);
    await fetchPresets();
    return newPreset;
  };

  const updatePreset = async (id: string, input: Partial<CreatePresetInput>) => {
    const updated = await repo.updatePreset(id, input);
    await fetchPresets();
    return updated;
  };

  const deletePreset = async (id: string) => {
    await repo.deletePreset(id);
    await fetchPresets();
  };

  return {
    presets,
    loading,
    refreshPresets: fetchPresets,
    addPreset,
    updatePreset,
    deletePreset
  };
}
