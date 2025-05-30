'use client';

import { useAuth } from '@/contexts/authContext/AuthContext';
import { Card, Typography } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Month } from './interfaces';
import { CustomTooltip } from './customTooltip';
import { Currency } from '@/interfaces/currency';
import api from '../../../../../axiosInstance';
import './monthsInfo.css';

const { Title } = Typography;

interface Props {
  userCurrency: Currency;
}

export const MonthsInfo = ({ userCurrency }: Props) => {
  const { user } = useAuth();
  const [months, setMonths] = useState<Month[]>([]);
  const [hasError, setHasError] = useState<boolean>(false);

  const getMonthsInfo = useCallback(async () => {
    if (user.id) {
      try {
        setHasError(false);

        const response = await api.get<Month[]>(`/finance_notes_summary/monthly/${user.id}`);
        setMonths(response.data);
      } catch {
        setHasError(true);
      }
    }
  }, [user.id]);

  useEffect(() => {
    getMonthsInfo();
  }, [getMonthsInfo]);

  return (
    <Card
      title='Months'
      style={{ width: '100%', backgroundColor: 'var(--foreground-color)', textAlign: 'center', marginBottom: 20 }}
      variant='borderless'
    >
      <ResponsiveContainer width='100%' height={400} style={{ backgroundColor: 'var(--background-color)' }}>
        {hasError ? (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Title level={5} style={{ color: 'var(--red-color)', margin: 0, textAlign: 'center' }}>
              Sorry, data is unavailable
            </Title>
          </div>
        ) : (
          <div className='scroll_container'>
            <LineChart width={months.length * 400} height={400} data={months}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='monthLabel' />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip content={<CustomTooltip userCurrency={userCurrency} />} cursor={{ fill: 'var(--foreground-color)' }} />
              <Legend />
              <Line type='monotone' dataKey='income' stroke='var(--green-color)' name='Income' />
              <Line type='monotone' dataKey='expense' stroke='var(--red-color)' name='Expense' />
            </LineChart>
          </div>
        )}
      </ResponsiveContainer>
    </Card>
  );
};
