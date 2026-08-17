import { useState, useEffect, useCallback } from 'react';
import { Transaction, CreateTransactionInput } from '../types/database';
import { DexieRepository } from '../db/repositories/dexieRepository';

const repo = new DexieRepository();

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const data = await repo.getTransactions();
      setTransactions(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const addTransaction = async (input: CreateTransactionInput) => {
    const tx = await repo.createTransaction(input);
    await fetchTransactions();
    return tx;
  };

  const record1TapPreset = async (preset: { account_id: string; category_id: string; amount: number; title: string }) => {
    const tx = await repo.createTransaction({
      account_id: preset.account_id,
      category_id: preset.category_id,
      type: 'expense',
      amount: preset.amount,
      note: preset.title,
      date: new Date().toISOString()
    });
    await fetchTransactions();
    return tx;
  };

  const deleteTransaction = async (id: string) => {
    await repo.deleteTransaction(id);
    await fetchTransactions();
  };

  return {
    transactions,
    loading,
    refreshTransactions: fetchTransactions,
    addTransaction,
    record1TapPreset,
    deleteTransaction
  };
}
