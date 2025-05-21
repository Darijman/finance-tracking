'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Typography } from 'antd';
import { Select } from '@/components/select/Select';
import { useAuth } from '@/contexts/authContext/AuthContext';
import { AvailableDate, IMonthSummary } from './interfaces';
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
}

export const MonthSummary = ({ availableDates }: Props) => {
  const { user } = useAuth();
  const [monthSummary, setMonthSummary] = useState<IMonthSummary>({
    incomeTotal: 0,
    expenseTotal: 0,
    balance: 0,
    recentNotes: [],
    noteCount: 0,
  });

  const [selectedDate, setSelectedDate] = useState<string>(currentStateDate);
  const [serverError, setServerError] = useState<{ error: string }>({ error: '' });

  const getMonthSummary = useCallback(
    async (year: number, month: number) => {
      try {
        if (user.id) {
          const response = await api.get<IMonthSummary>(`/finance_notes_summary/${user.id}`, { params: { year, month } });
          setMonthSummary(response.data);
        }
      } catch (error: any) {
        setServerError(error);
      }
    },
    [user.id],
  );

  useEffect(() => {
    getMonthSummary(currentYear, currentMonth);
  }, [getMonthSummary]);

  const monthOnChangeHandler = (value: string | string[]) => {
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
    return [
      ...availableDates.map(({ month, year }) => {
        const date = new Date(year, month - 1);
        const label = date.toLocaleString('en-US', { month: 'long', year: 'numeric' });
        const value = `${year}-${month.toString().padStart(2, '0')}`;
        return { value, label };
      }),
    ];
  }, [availableDates]);

  return (
    <div className='month_summary'>
      <div className='month_summary_top'>
        {serverError.error ? (
          <Title level={3} style={{ margin: 0, color: '#d32f2f' }}>
            {serverError.error}
          </Title>
        ) : (
          <Title level={3} style={{ margin: 0 }}>
            {displayedDate}
          </Title>
        )}
        <Select
          placeholder='Select a date'
          value={selectedDate}
          onChange={monthOnChangeHandler}
          style={{ width: 200, textAlign: 'center' }}
          options={dates}
        />
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
