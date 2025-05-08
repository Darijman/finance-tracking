'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Typography } from 'antd';
import { Select } from '@/components/select/Select';
import { useAuth } from '@/contexts/authContext/AuthContext';
import { FinanceNote } from '@/interfaces/financeNote';
import { useLoader } from '@/contexts/loaderContext/LoaderContext';
import { Loader } from '@/ui/loader/Loader';
import api from '../../../../../axiosInstance';
import './monthSummary.css';

const { Title } = Typography;

const now = new Date();
const currentYear = now.getFullYear();
const currentMonth = now.getMonth() + 1;
const currentDate = now.toLocaleString('en-US', { month: 'long', year: 'numeric' }) + `:`;

interface AvailableMonth {
  month: number;
  year: number;
}

interface MonthSummary {
  incomeTotal: number;
  expenseTotal: number;
  balance: number;
  recentNotes: FinanceNote[];
  noteCount: number;
}

export const MonthSummary = () => {
  const { user } = useAuth();
  const { isLoading, showLoader, hideLoader } = useLoader();
  const [monthSummary, setMonthSummary] = useState<MonthSummary>({
    incomeTotal: 0,
    expenseTotal: 0,
    balance: 0,
    recentNotes: [],
    noteCount: 0,
  });

  const [availableMonths, setAvailableMonths] = useState<AvailableMonth[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [serverError, setServerError] = useState<{ error: string }>({ error: '' });

  const getMonthSummary = useCallback(
    async (year?: number, month?: number) => {
      showLoader();
      try {
        if (user.id) {
          const response = await api.get<MonthSummary>(`/finance_notes_summary/${user.id}?year=${year}&month=${month}`);
          setMonthSummary(response.data);
        }
      } catch (error: any) {
        setServerError(error);
      } finally {
        hideLoader();
      }
    },
    [user.id, showLoader, hideLoader],
  );

  const getAvailableMonths = useCallback(async () => {
    showLoader();
    try {
      if (user.id) {
        const response = await api.get<AvailableMonth[]>(`/finance_notes_summary/months/${user.id}`);
        setAvailableMonths(response.data);
      }
    } catch (error: any) {
      setServerError(error);
    } finally {
      hideLoader();
    }
  }, [user.id, showLoader, hideLoader]);

  useEffect(() => {
    getMonthSummary(currentYear, currentMonth);
    getAvailableMonths();
  }, [getMonthSummary, getAvailableMonths]);

  const monthOnChangeHandler = (value: string | string[]) => {
    if (Array.isArray(value)) return;

    setSelectedMonth(value);

    if (value === '') {
      getMonthSummary(currentYear, currentMonth);
      return;
    }

    const [year, month] = value.split('-').map(Number);
    getMonthSummary(year, month);
  };

  const displayedMonth = useMemo(() => {
    if (!selectedMonth) return currentDate;

    const [year, month] = selectedMonth.split('-').map(Number);
    const date = new Date(year, month - 1);
    return date.toLocaleString('en-US', { month: 'long', year: 'numeric' }) + `:`;
  }, [selectedMonth]);

  const months = useMemo(() => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    return [
      { value: '', label: 'Select a month', style: { color: 'var(--secondary-text-color)' } },
      ...availableMonths
        .filter(({ year, month }) => {
          return !(year === currentYear && month === currentMonth);
        })
        .map(({ month, year }) => {
          const date = new Date(year, month - 1);
          const label = date.toLocaleString('en-US', { month: 'long', year: 'numeric' });
          const value = `${year}-${month.toString().padStart(2, '0')}`;
          return { value, label };
        }),
    ];
  }, [availableMonths]);

  return (
    <div className='month_summary'>
      <div className='month_summary_top'>
        {isLoading ? (
          <Loader style={{ width: '30px' }} />
        ) : serverError.error ? (
          <Title level={3} style={{ margin: 0, color: '#d32f2f' }}>
            {serverError.error}
          </Title>
        ) : (
          <Title level={3} style={{ margin: 0 }}>
            {displayedMonth}
          </Title>
        )}
        <Select placeholder='Select a month' value={selectedMonth} onChange={monthOnChangeHandler} style={{ width: 200 }} options={months} />
      </div>
      <dl className='month_summary_list'>
        <div className='month_summary_list_item income'>
          <dt>INCOME TOTAL:</dt>
          <dd>+{monthSummary.incomeTotal}</dd>
        </div>
        <div className='month_summary_list_item expense'>
          <dt>EXPENSE TOTAL:</dt>
          <dd>-{monthSummary.expenseTotal}</dd>
        </div>
        <div className='month_summary_list_item'>
          <dt>BALANCE:</dt>
          <dd>{monthSummary.balance}</dd>
        </div>
        <div className='month_summary_list_item'>
          <dt>NOTES DONE:</dt>
          <dd>{monthSummary.noteCount}</dd>
        </div>
      </dl>
    </div>
  );
};
