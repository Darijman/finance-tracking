'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/contexts/authContext/AuthContext';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, notification, Typography } from 'antd';
import { AvailableDate } from '../monthSummary/interfaces';
import { Select } from '@/components/select/Select';
import { CustomTooltip } from './customTooltip';
import { CategoryInfo } from './interfaces';
import { CreateCustomTick } from './createCustomTick';
import { Currency } from '@/interfaces/currency';
import api from '../../../../../axiosInstance';
import './categoriesInfo.css';

const { Title } = Typography;

const now = new Date();
const currentYear = now.getFullYear();
const currentMonth = now.getMonth() + 1;
const currentDate = `${currentYear}-${currentMonth.toString().padStart(2, '0')}`;

interface Props {
  availableDates: AvailableDate[];
  userCurrency: Currency;
}

export const CategoriesInfo = ({ availableDates, userCurrency }: Props) => {
  const { user } = useAuth();

  const [categoriesInfo, setCategoriesInfo] = useState<CategoryInfo[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(currentDate);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [notificationApi, notificationContextHolder] = notification.useNotification({
    maxCount: 2,
    placement: 'top',
    duration: 5,
  });

  const getCategoriesInfo = useCallback(
    async (year: number, month: number) => {
      if (user.id) {
        try {
          setIsLoading(true);
          setHasError(false);

          const response = await api.get<CategoryInfo[]>(`/finance_notes_analytics/expenses_category/${user.id}`, {
            params: { year, month },
          });

          setCategoriesInfo(response.data);
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
    getCategoriesInfo(currentYear, currentMonth);
  }, [getCategoriesInfo]);

  useEffect(() => {
    if (hasError) {
      notificationApi.error({
        message: 'Something went wrong..',
        description: 'We couldn’t load data for this date. Please try again later.',
      });
    }
  }, [hasError, notificationApi]);

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

  const formattedDate = new Date(selectedDate).toLocaleString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <>
      {notificationContextHolder}
      <Card
        title={
          <div className='card_title_wrapper'>
            <Title level={4} style={{ margin: '10px 0px' }}>
              Categories ({formattedDate})
            </Title>
            <div className='card_select_wrapper'>
              <Select
                placeholder='Select a date'
                value={formattedDate}
                onChange={monthOnChangeHandler}
                style={{ width: 200, marginBottom: '10px' }}
                options={dates}
                loading={isLoading}
              />
            </div>
          </div>
        }
        style={{
          width: '100%',
          backgroundColor: 'var(--foreground-color)',
          textAlign: 'center',
        }}
        variant='borderless'
      >
        <div style={{ width: '100%', overflowX: 'auto' }}>
          <div style={{ width: `${chartData.length * 100}px`, minWidth: '600px', height: '400px' }}>
            <ResponsiveContainer width='100%' height='100%' style={{ backgroundColor: 'var(--background-color)', overflowY: 'hidden' }}>
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
                <BarChart data={chartData}>
                  <XAxis
                    dataKey='name'
                    interval={0}
                    height={80}
                    tick={(tickProps) => <CreateCustomTick {...tickProps} categoriesInfo={categoriesInfo} />}
                  />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip content={<CustomTooltip userCurrency={userCurrency} />} cursor={{ fill: 'var(--foreground-color)' }} />
                  <Bar dataKey='totalExpense' fill='#8884d8' barSize={40} name='Total Expenses' />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>
      </Card>
    </>
  );
};
