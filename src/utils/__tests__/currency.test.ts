import { describe, it, expect } from 'vitest';
import { formatIDR } from '../currency';

describe('White-box Test: formatIDR Currency Helper', () => {
  it('should format positive integer amounts correctly', () => {
    expect(formatIDR(15000)).toBe('Rp 15.000');
    expect(formatIDR(1000000)).toBe('Rp 1.000.000');
    expect(formatIDR(500)).toBe('Rp 500');
  });

  it('should format zero correctly', () => {
    expect(formatIDR(0)).toBe('Rp 0');
  });

  it('should format negative integer amounts correctly', () => {
    expect(formatIDR(-5000)).toBe('-Rp 5.000');
    expect(formatIDR(-250000)).toBe('-Rp 250.000');
  });

  it('should handle decimals by rounding to nearest integer (Financial Precision Rule)', () => {
    expect(formatIDR(15000.4)).toBe('Rp 15.000');
    expect(formatIDR(15000.8)).toBe('Rp 15.001');
  });

  it('should handle null, undefined, and NaN gracefully', () => {
    expect(formatIDR(null)).toBe('Rp 0');
    expect(formatIDR(undefined)).toBe('Rp 0');
    expect(formatIDR(NaN)).toBe('Rp 0');
  });
});
