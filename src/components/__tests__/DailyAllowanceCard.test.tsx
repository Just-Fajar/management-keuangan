// @vitest-environment jsdom
import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { DailyAllowanceCard } from '../DailyAllowanceCard';

describe('White-box & Black-box Test: DailyAllowanceCard Component', () => {
  afterEach(() => {
    cleanup();
  });

  it('should calculate daily allowance correctly based on remaining budget and remaining days', () => {
    render(<DailyAllowanceCard totalMonthlyBudget={1500000} currentMonthSpent={300000} />);

    expect(screen.getByText('Daily Allowance (Jatah Harian Aman)')).toBeDefined();
    expect(screen.getByText('/ hari')).toBeDefined();
    expect(screen.getByText('Rp 1.200.000')).toBeDefined();
  });

  it('should display Over Budget badge when currentMonthSpent exceeds totalMonthlyBudget', () => {
    render(<DailyAllowanceCard totalMonthlyBudget={1000000} currentMonthSpent={1200000} />);

    expect(screen.getByText('Over Budget')).toBeDefined();
    expect(screen.getAllByText('Rp 0').length).toBeGreaterThan(0);
  });
});
