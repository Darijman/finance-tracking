'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Typography } from 'antd';
import { Select } from '@/components/select/Select';
import { useAuth } from '@/contexts/authContext/AuthContext';
import { AvailableDate, IMonthSummary } from './interfaces';
import { formatCurrency } from '@/components/financeNoteCard/FinanceNoteCard';
import { Currency } from '@/interfaces/currency';
import api from '../../../../../axiosInstance';
import './monthSummary.css';
import './responsive.css';

const { Title } = Typography;

const now = new Date();
const currentYear = now.getFullYear();
const currentMonth = now.getMonth() + 1;
const currentDate = now.toLocaleString('en-US', { month: 'long', year: 'numeric' }) + `:`;
const currentStateDate = `${currentYear}-${currentMonth.toString().padStart(2, '0')}`;

interface Props {
  availableDates: AvailableDate[];
  userCurrency: Currency;
}

export const MonthSummary = ({ availableDates, userCurrency }: Props) => {
  const { user } = useAuth();
  const [monthSummary, setMonthSummary] = useState<IMonthSummary>({
    incomeTotal: 0,
    expenseTotal: 0,
    balance: 0,
    noteCount: 0,
  });

  const [selectedDate, setSelectedDate] = useState<string>(currentStateDate);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);

  const getMonthSummary = useCallback(
    async (year: number, month: number) => {
      if (user.id) {
        try {
          setIsLoading(true);
          setHasError(false);

          const response = await api.get<IMonthSummary>(`/finance_notes_summary/${user.id}`, { params: { year, month } });
          setMonthSummary(response.data);
        } catch {
          setHasError(true);
        } finally {
          setIsLoading(false);
        }
      }
    },
    [user.id],
  );

  useEffect(() => {
    getMonthSummary(currentYear, currentMonth);
  }, [getMonthSummary]);

  const dateOnChangeHandler = (value: string | string[]) => {
    if (Array.isArray(value)) return;
    setSelectedDate(value);

    const [year, month] = value.split('-').map(Number);
    getMonthSummary(year, month);
  };

  const displayedDate = useMemo(() => {
    if (!selectedDate) return currentDate;

    const [year, month] = selectedDate.split('-').map(Number);
    const date = new Date(year, month - 1);
    return date.toLocaleString('en-US', { month: 'long', year: 'numeric' }) + `:`;
  }, [selectedDate]);

  const dates = useMemo(() => {
    const currentLabel = now.toLocaleString('en-US', { month: 'long', year: 'numeric' });

    const mappedDates = availableDates.map(({ month, year }) => {
      const date = new Date(year, month - 1);
      const label = date.toLocaleString('en-US', { month: 'long', year: 'numeric' });
      const value = `${year}-${month.toString().padStart(2, '0')}`;
      return { value, label };
    });

    const hasCurrentDate = mappedDates.some((date) => date.value === currentStateDate);
    if (!hasCurrentDate) {
      return [{ value: currentStateDate, label: currentLabel }, ...mappedDates];
    }

    return mappedDates;
  }, [availableDates]);

  const renderContent = () => {
    if (hasError) {
      return (
        <Title level={5} style={{ color: 'var(--red-color)', textAlign: 'center', margin: 0 }}>
          Sorry, data is unavailable
        </Title>
      );
    }

    return (
      <>
        <div className='alltime_summary_list_item income'>
          <dt>INCOME TOTAL:</dt>
          <dd>+{formatCurrency(monthSummary.incomeTotal, userCurrency?.code)}</dd>
        </div>
        <div className='alltime_summary_list_item expense'>
          <dt>EXPENSE TOTAL:</dt>
          <dd>-{formatCurrency(monthSummary.expenseTotal, userCurrency?.code)}</dd>
        </div>
        <div className='alltime_summary_list_item'>
          <dt>BALANCE:</dt>
          <dd>{formatCurrency(monthSummary.balance, userCurrency?.code)}</dd>
        </div>
        <div className='alltime_summary_list_item'>
          <dt>NOTES DONE:</dt>
          <dd>{monthSummary.noteCount.toLocaleString('ru-RU')}</dd>
        </div>
      </>
    );
  };

  return (
    <div className='month_summary'>
      <div className='month_summary_top'>
        <Title level={3} style={{ margin: '0px' }} className='month_summary_top_title'>
          {displayedDate}
        </Title>
        <Select
          placeholder='Select a date'
          value={selectedDate}
          onChange={dateOnChangeHandler}
          style={{ width: 200, textAlign: 'center' }}
          options={dates}
          loading={isLoading}
          disabled={isLoading}
        />
      </div>
      <dl className='month_summary_list'>{renderContent()}</dl>
    </div>
  );
};
