/**
 * Centralized Currency Helper for IDR (Indonesian Rupiah).
 * Enforces Financial Precision Rule: Whole integer amounts without decimals.
 */
export function formatIDR(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return 'Rp 0';
  }

  const rounded = Math.round(amount);
  const isNegative = rounded < 0;
  const absAmount = Math.abs(rounded);

  const formattedNumber = absAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  return isNegative ? `-Rp ${formattedNumber}` : `Rp ${formattedNumber}`;
}
