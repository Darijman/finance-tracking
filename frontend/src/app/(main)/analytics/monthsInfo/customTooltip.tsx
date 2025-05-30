'use client';

import { formatCurrency } from '@/components/financeNoteCard/FinanceNoteCard';

export const CustomTooltip = ({ active, payload, userCurrency }: any) => {
  if (active && payload && payload.length) {
    const income = payload.find((item: any) => item.dataKey === 'income')?.value || 0;
    const expense = payload.find((item: any) => item.dataKey === 'expense')?.value || 0;

    return (
      <div
        style={{
          background: 'var(--foreground-color)',
          padding: 10,
          border: 'none',
          borderRadius: '10px',
          color: 'var(--primary-text-color)',
          textAlign: 'left',
        }}
      >
        <p style={{ margin: 0, color: 'var(--green-color)', fontSize: '16px' }}>{`Income: ${formatCurrency(income, userCurrency.code)}`}</p>
        <p style={{ margin: 0, color: 'var(--red-color)', fontSize: '16px' }}>{`Expense: ${formatCurrency(expense, userCurrency.code)}`}</p>
      </div>
    );
  }
  return null;
};
