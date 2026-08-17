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
      let data = await repo.getCategories();
      // Seed default categories if empty
      if (data.length === 0) {
        const catMakan = await repo.createCategory({ name: 'Makan & Minum', type: 'expense', monthly_budget: 1500000 });
        const catBensin = await repo.createCategory({ name: 'Bensin & Transport', type: 'expense', monthly_budget: 300000 });
        const catBelanja = await repo.createCategory({ name: 'Belanja Harian', type: 'expense', monthly_budget: 500000 });
        const catGaji = await repo.createCategory({ name: 'Gaji & Income', type: 'income' });
        data = [catMakan, catBensin, catBelanja, catGaji];
      }
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

  return {
    categories,
    loading,
    refreshCategories: fetchCategories,
    addCategory
  };
}
