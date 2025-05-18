'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/contexts/authContext/AuthContext';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Card } from 'antd';
import { AvailableDate } from '../monthSummary/interfaces';
import { Select } from '@/components/select/Select';
import { CustomTooltip } from './customTooltip';
import { CategoryInfo } from './interfaces';
import { CreateCustomTick } from './createCustomTick';
import api from '../../../../../axiosInstance';

const now = new Date();
const currentYear = now.getFullYear();
const currentMonth = now.getMonth() + 1;
const currentDate = `${currentYear}-${currentMonth.toString().padStart(2, '0')}`;

interface Props {
  availableDates: AvailableDate[];
}

export const CategoriesInfo = ({ availableDates }: Props) => {
  const { user } = useAuth();

  const [categoriesInfo, setCategoriesInfo] = useState<CategoryInfo[]>([]);

  const [selectedDate, setSelectedDate] = useState<string>(currentDate);

  const getCategoriesInfo = useCallback(
    async (year: number, month: number) => {
      if (user.id) {
        const response = await api.get<CategoryInfo[]>(`/finance_notes_analytics/expenses_category/${user.id}`, { params: { year, month } });
        setCategoriesInfo(response.data);
      }
    },
    [user.id],
  );

  useEffect(() => {
    getCategoriesInfo(currentYear, currentMonth);
  }, [getCategoriesInfo]);

  const monthOnChangeHandler = (value: string | string[]) => {
    if (Array.isArray(value)) return;
    setSelectedDate(value);

    const [year, month] = value.split('-').map(Number);
    getCategoriesInfo(year, month);
  };

  const chartData = categoriesInfo.map((item) => ({
    name: item.category.name,
    totalExpense: item.totalExpense,
  }));

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
    <Card
      title={'Categories'}
      style={{ width: '100%', backgroundColor: 'var(--foreground-color)', textAlign: 'center' }}
      variant='borderless'
      extra={
        <Select
          placeholder='Select a date'
          value={selectedDate}
          onChange={monthOnChangeHandler}
          style={{ width: 200, position: 'absolute', right: 10, top: 10 }}
          options={dates}
        />
      }
    >
      <ResponsiveContainer width='100%' height={400} style={{ backgroundColor: 'var(--background-color)' }}>
        {chartData.length ? (
          <BarChart data={chartData}>
            <XAxis
              dataKey='name'
              interval={0}
              height={80}
              tick={(tickProps) => <CreateCustomTick {...tickProps} categoriesInfo={categoriesInfo} />}
            />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--foreground-color)' }} />
            <Bar dataKey='totalExpense' fill='#8884d8' barSize={40} name='Total Expenses' />
          </BarChart>
        ) : (
          <div></div>
        )}
      </ResponsiveContainer>
    </Card>
  );
};
