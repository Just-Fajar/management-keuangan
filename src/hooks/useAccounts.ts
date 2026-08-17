import { useState, useEffect, useCallback } from 'react';
import { Account, CreateAccountInput } from '../types/database';
import { DexieRepository } from '../db/repositories/dexieRepository';

const repo = new DexieRepository();

export function useAccounts() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchAccounts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await repo.getAccounts();
      setAccounts(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const addAccount = async (input: CreateAccountInput) => {
    const newAcc = await repo.createAccount(input);
    await fetchAccounts();
    return newAcc;
  };

  const updateAccount = async (id: string, input: Partial<CreateAccountInput>) => {
    const updated = await repo.updateAccount(id, input);
    await fetchAccounts();
    return updated;
  };

  const deleteAccount = async (id: string) => {
    await repo.deleteAccount(id);
    await fetchAccounts();
  };

  const getAccountBalance = async (accountId: string) => {
    return await repo.getAccountBalance(accountId);
  };

  const getTotalCombinedBalance = async () => {
    return await repo.getTotalCombinedBalance();
  };

  return {
    accounts,
    loading,
    refreshAccounts: fetchAccounts,
    addAccount,
    updateAccount,
    deleteAccount,
    getAccountBalance,
    getTotalCombinedBalance
  };
}
