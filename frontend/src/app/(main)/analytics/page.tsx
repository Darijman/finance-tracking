'use client';

import { useCallback, useEffect, useState } from 'react';
import { notification, Typography } from 'antd';
import { MonthsInfo } from './monthsInfo/MonthsInfo';
import { CategoriesInfo } from './categoriesInfo/CategoriesInfo';
import { MonthSummary } from './monthSummary/MonthSummary';
import { AllTimeSummary } from './allTimeSummary/AllTimeSummary';
import { AvailableDate } from './monthSummary/interfaces';
import { useAuth } from '@/contexts/authContext/AuthContext';
import { useLoader } from '@/contexts/loaderContext/LoaderContext';
import { Loader } from '@/ui/loader/Loader';
import api from '../../../../axiosInstance';
import './analytics.css';
import './responsive.css';

const { Title } = Typography;

const Analytics = () => {
  const { user } = useAuth();
  const { isLoading, hideLoader, showLoader } = useLoader();
  const [availableDates, setAvailableDates] = useState<AvailableDate[]>([]);

  const [hasError, setHasError] = useState<boolean>(false);
  const [notificationApi, contextHolder] = notification.useNotification({
    maxCount: 2,
    placement: 'top',
    duration: 5,
  });

  const getAvailableDates = useCallback(async () => {
    if (user.id) {
      try {
        showLoader();

        const response = await api.get<AvailableDate[]>(`/finance_notes_summary/months/${user.id}`);
        setAvailableDates(response.data);
      } catch {
        setHasError(true);
      } finally {
        hideLoader();
      }
    }
  }, [user.id, hideLoader, showLoader]);

  useEffect(() => {
    getAvailableDates();
  }, [getAvailableDates]);

  useEffect(() => {
    if (hasError) {
      notificationApi.error({
        message: 'Something went wrong..',
        description: ' Some parts of your analytics couldn’t be loaded. Please try again later.',
      });
      setHasError(false);
    }
  }, [hasError, notificationApi]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div>
      {contextHolder}
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
