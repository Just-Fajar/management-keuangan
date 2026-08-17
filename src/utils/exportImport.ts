import { Account, Category, Transaction, Preset } from '../types/database';
import { IDatabaseRepository } from '../db/repositories/types';

export interface BackupDataPayload {
  version: number;
  exportDate: string;
  accounts: Account[];
  categories: Category[];
  transactions: Transaction[];
  presets: Preset[];
}

export function generateJSONBackup(
  accounts: Account[],
  categories: Category[],
  transactions: Transaction[],
  presets: Preset[]
): string {
  const payload: BackupDataPayload = {
    version: 1,
    exportDate: new Date().toISOString(),
    accounts,
    categories,
    transactions,
    presets
  };
  return JSON.stringify(payload, null, 2);
}

export function generateTransactionsCSV(
  transactions: Transaction[],
  accounts: Account[],
  categories: Category[]
): string {
  const headers = ['ID', 'Tanggal', 'Tipe', 'Dompet', 'Target Dompet', 'Kategori', 'Nominal (Rp)', 'Catatan'];

  const rows = transactions.map((t) => {
    const acc = accounts.find((a) => a.id === t.account_id)?.name || t.account_id;
    const targetAcc = t.target_account_id
      ? accounts.find((a) => a.id === t.target_account_id)?.name || t.target_account_id
      : '-';
    const cat = t.category_id ? categories.find((c) => c.id === t.category_id)?.name || t.category_id : '-';

    const safeNote = t.note ? `"${t.note.replace(/"/g, '""')}"` : '""';

    return [
      t.id,
      t.date,
      t.type,
      `"${acc}"`,
      `"${targetAcc}"`,
      `"${cat}"`,
      t.amount,
      safeNote
    ].join(',');
  });

  return [headers.join(','), ...rows].join('\n');
}

export async function parseAndRestoreJSONBackup(
  jsonContent: string,
  repo: IDatabaseRepository
): Promise<{ accountsCount: number; categoriesCount: number; transactionsCount: number; presetsCount: number }> {
  let parsed: BackupDataPayload;
  try {
    parsed = JSON.parse(jsonContent);
  } catch (err) {
    throw new Error('Format file JSON tidak valid. ' + (err as Error).message);
  }

  if (!Array.isArray(parsed.accounts) || !Array.isArray(parsed.categories) || !Array.isArray(parsed.transactions)) {
    throw new Error('Struktur data cadangan JSON tidak lengkap.');
  }

  // Restore accounts
  for (const acc of parsed.accounts) {
    const existing = await repo.getAccountById(acc.id);
    if (!existing) {
      await repo.createAccount({
        name: acc.name,
        type: acc.type,
        initial_balance: acc.initial_balance,
        color: acc.color
      });
    }
  }

  // Restore categories
  for (const cat of parsed.categories) {
    const existing = await repo.getCategoryById(cat.id);
    if (!existing) {
      await repo.createCategory({
        name: cat.name,
        type: cat.type,
        monthly_budget: cat.monthly_budget,
        daily_budget: cat.daily_budget
      });
    }
  }

  // Restore transactions
  for (const tx of parsed.transactions) {
    const existing = await repo.getTransactionById(tx.id);
    if (!existing) {
      await repo.createTransaction({
        account_id: tx.account_id,
        target_account_id: tx.target_account_id,
        category_id: tx.category_id,
        type: tx.type,
        amount: tx.amount,
        note: tx.note,
        date: tx.date
      });
    }
  }

  // Restore presets
  if (Array.isArray(parsed.presets)) {
    for (const p of parsed.presets) {
      const existing = await repo.getPresetById(p.id);
      if (!existing) {
        await repo.createPreset({
          title: p.title,
          account_id: p.account_id,
          category_id: p.category_id,
          amount: p.amount
        });
      }
    }
  }

  return {
    accountsCount: parsed.accounts.length,
    categoriesCount: parsed.categories.length,
    transactionsCount: parsed.transactions.length,
    presetsCount: parsed.presets ? parsed.presets.length : 0
  };
}

export function downloadFile(filename: string, content: string, contentType: string) {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
