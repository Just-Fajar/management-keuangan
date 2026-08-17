// @vitest-environment jsdom
import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { SoftLimitProgressBar, getSoftLimitStatus } from '../SoftLimitProgressBar';

describe('White-box Test: getSoftLimitStatus logic', () => {
  it('should return green status for spending under 75%', () => {
    const res = getSoftLimitStatus(500000, 1000000);
    expect(res.status).toBe('green');
    expect(res.label).toBe('Aman (<75%)');
  });

  it('should return yellow status for spending between 75% and 90%', () => {
    const res = getSoftLimitStatus(800000, 1000000);
    expect(res.status).toBe('yellow');
    expect(res.label).toBe('Waspada (75-90%)');
  });

  it('should return red status for spending over 90%', () => {
    const res = getSoftLimitStatus(950000, 1000000);
    expect(res.status).toBe('red');
    expect(res.label).toBe('Kritis (>90%)');
  });

  it('should handle budget exceeded over 100%', () => {
    const res = getSoftLimitStatus(1200000, 1000000);
    expect(res.status).toBe('red');
    expect(res.label).toBe('Melebihi 100%');
  });
});

describe('Black-box Test: SoftLimitProgressBar Component UI', () => {
  afterEach(() => {
    cleanup();
  });

  it('should render category name and budget progress correctly', () => {
    render(<SoftLimitProgressBar categoryName="Makan & Minum" spentAmount={500000} monthlyBudget={1000000} />);

    expect(screen.getByText('Makan & Minum')).toBeDefined();
    expect(screen.getByText('Aman (<75%)')).toBeDefined();
    expect(screen.getByText('Rp 500.000')).toBeDefined();
    expect(screen.getByText('Rp 1.000.000')).toBeDefined();
  });
});
