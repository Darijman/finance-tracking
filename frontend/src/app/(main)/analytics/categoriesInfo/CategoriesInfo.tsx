'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/authContext/AuthContext';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Card } from 'antd';
import { useTheme } from 'next-themes';
import { Button } from '@/components/button/Button';
import api from '../../../../../axiosInstance';
import './categoriesInfo.css';

const currentMonth = new Date().toLocaleString('en-US', { month: 'long' });

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: 'var(--foreground-color)',
          padding: 10,
          border: 'none',
          borderRadius: '10px',
          color: 'var(--primary-text-color)',
        }}
      >
        <p style={{ margin: 0 }}>{label}</p>
        <p style={{ margin: 0, color: '#8884d8' }}>{`Total Spent: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

interface CustomTickProps {
  x: number;
  y: number;
  payload: { value: string };
}

interface CategoryInfo {
  category: { id: number; name: string; image: string };
  totalExpense: number;
}

export const CategoriesInfo = () => {
  const { user } = useAuth();
  const { resolvedTheme } = useTheme();

  const [categoriesInfo, setCategoriesInfo] = useState<CategoryInfo[]>([]);
  const [onlyCurrentMonth, setOnlyCurrentMonth] = useState<boolean>(false);

  const getCategoriesInfo = useCallback(async () => {
    if (user.id) {
      const response = await api.get<CategoryInfo[]>(`/finance_notes_analytics/expenses_category/${user.id}`, {
        params: { period: onlyCurrentMonth ? 'month' : 'all' },
      });
      setCategoriesInfo(response.data);
    }
  }, [user.id, onlyCurrentMonth]);

  useEffect(() => {
    getCategoriesInfo();
  }, [getCategoriesInfo]);

  const CustomTick = ({ x, y, payload }: CustomTickProps) => {
    const category = categoriesInfo.find((c) => c.category.name === payload.value);
    const imagePath = category?.category.image
      ? `http://localhost:9000/uploads/${category.category.image}`
      : 'http://localhost:9000/uploads/questionMark-icon.svg';

    return (
      <g transform={`translate(${x},${y + 10})`}>
        <image
          href={imagePath}
          width={30}
          height={30}
          x={-15}
          y={0}
          style={{ filter: resolvedTheme === 'dark' ? 'invert(1)' : 'invert(0)' }}
        />
        <text x={0} y={45} textAnchor='middle' fill='#666' fontSize={12}>
          {payload.value}
        </text>
      </g>
    );
  };

  const chartData = categoriesInfo.map((item) => ({
    name: item.category.name,
    totalExpense: item.totalExpense,
  }));

  return (
    <Card
      title={onlyCurrentMonth ? `Categories (${currentMonth})` : `Categories (All Time)`}
      style={{ width: '100%', backgroundColor: 'var(--foreground-color)', textAlign: 'center' }}
      variant='borderless'
      extra={
        <Button
          className={onlyCurrentMonth ? 'only_current_month_button active' : 'only_current_month_button'}
          onClick={() => setOnlyCurrentMonth((prevState) => !prevState)}
          label={`Only ${currentMonth}`}
        />
      }
    >
      <ResponsiveContainer width='100%' height={400} style={{ backgroundColor: 'var(--background-color)' }}>
        {chartData.length ? (
          <BarChart data={chartData}>
            <XAxis dataKey='name' tick={CustomTick} interval={0} height={80} />
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
