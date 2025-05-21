'use client';

import { useCallback, useEffect, useState } from 'react';
import { Typography } from 'antd';
import { MonthsInfo } from './monthsInfo/MonthsInfo';
import { CategoriesInfo } from './categoriesInfo/CategoriesInfo';
import { MonthSummary } from './monthSummary/MonthSummary';
import { AllTimeSummary } from './allTimeSummary/AllTimeSummary';
import { AvailableDate } from './monthSummary/interfaces';
import { useAuth } from '@/contexts/authContext/AuthContext';
import api from '../../../../axiosInstance';
import './analytics.css';
import './responsive.css';

const { Title } = Typography;

const Analytics = () => {
  const { user } = useAuth();
  const [availableDates, setAvailableDates] = useState<AvailableDate[]>([]);
  const [serverError, setServerError] = useState<{ error: string }>({ error: '' });

  const getAvailableDates = useCallback(async () => {
    try {
      if (user.id) {
        const response = await api.get<AvailableDate[]>(`/finance_notes_summary/months/${user.id}`);
        setAvailableDates(response.data);
      }
    } catch (error: any) {
      setServerError(error);
    }
  }, [user.id]);

  useEffect(() => {
    getAvailableDates();
  }, [getAvailableDates]);

  return (
    <div>
      <Title level={1} style={{ textAlign: 'center', margin: '0px 0px 20px 0px' }}>
        Analytics
      </Title>
      <div>
        <div className='analytics_summary'>
          <MonthSummary availableDates={availableDates} />
          <AllTimeSummary />
        </div>
        <div>
          <MonthsInfo />
          <CategoriesInfo availableDates={availableDates} />
        </div>
      </div>
    </div>
  );
};

export default Analytics;
