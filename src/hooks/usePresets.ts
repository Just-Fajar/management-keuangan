import { useState, useEffect, useCallback } from 'react';
import { Preset, CreatePresetInput } from '../types/database';
import { DexieRepository } from '../db/repositories/dexieRepository';

const repo = new DexieRepository();

export function usePresets() {
  const [presets, setPresets] = useState<Preset[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchPresets = useCallback(async () => {
    setLoading(true);
    try {
      const data = await repo.getPresets();
      setPresets(data);
    } finally {
      setLoading(false);
    }
  }, []);

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
