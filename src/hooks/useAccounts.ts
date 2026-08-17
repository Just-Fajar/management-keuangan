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
      let data = await repo.getAccounts();
      // Seed default accounts if empty
      if (data.length === 0) {
        const defaultCash = await repo.createAccount({ name: 'Cash', type: 'cash', initial_balance: 100000, color: '#10B981' });
        const defaultBank = await repo.createAccount({ name: 'Bank Utama', type: 'bank', initial_balance: 500000, color: '#3B82F6' });
        const defaultEWallet = await repo.createAccount({ name: 'E-Wallet', type: 'ewallet', initial_balance: 50000, color: '#8B5CF6' });
        data = [defaultCash, defaultBank, defaultEWallet];
      }
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
    getAccountBalance,
    getTotalCombinedBalance
  };
}
