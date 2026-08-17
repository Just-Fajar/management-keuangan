import { useState, useEffect, useCallback } from 'react';
import { Category, CreateCategoryInput } from '../types/database';
import { DexieRepository } from '../db/repositories/dexieRepository';

const repo = new DexieRepository();

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const data = await repo.getCategories();
      setCategories(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const addCategory = async (input: CreateCategoryInput) => {
    const newCat = await repo.createCategory(input);
    await fetchCategories();
    return newCat;
  };

  const updateCategoryBudget = async (id: string, monthly_budget: number) => {
    const updated = await repo.updateCategory(id, { monthly_budget });
    await fetchCategories();
    return updated;
  };

  return {
    categories,
    loading,
    refreshCategories: fetchCategories,
    addCategory,
    updateCategoryBudget
  };
}
