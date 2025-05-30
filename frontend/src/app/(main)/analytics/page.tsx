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
import { Currency } from '@/interfaces/currency';
import api from '../../../../axiosInstance';
import './analytics.css';
import './responsive.css';

const { Title } = Typography;

const Analytics = () => {
  const { user } = useAuth();
  const { isLoading, hideLoader, showLoader } = useLoader();

  const [availableDates, setAvailableDates] = useState<AvailableDate[]>([]);
  const [userCurrency, setUserCurrency] = useState<Currency>({
    id: 0,
    name: '',
    symbol: '',
    code: '',
    flag: '',
    createdAt: '',
    updatedAt: '',
  });

  const [hasError, setHasError] = useState<boolean>(false);
  const [notificationApi, contextHolder] = notification.useNotification({
    maxCount: 2,
    placement: 'top',
    duration: 5,
  });

  const getData = useCallback(async () => {
    if (user.id) {
      try {
        showLoader();

        const [dates, userCurrency] = await Promise.all([
          api.get<AvailableDate[]>(`/finance_notes_summary/months/${user.id}`),
          api.get<Currency>(`/users/currency/${user.id}`),
        ]);

        setAvailableDates(dates.data);
        setUserCurrency(userCurrency.data);
      } catch {
        setHasError(true);
      } finally {
        hideLoader();
      }
    }
  }, [user.id, hideLoader, showLoader]);

  console.log(`userCurrency`, userCurrency);

  useEffect(() => {
    getData();
  }, [getData]);

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
          <MonthSummary availableDates={availableDates} userCurrency={userCurrency} />
          <AllTimeSummary userCurrency={userCurrency} />
        </div>
        <div>
          <MonthsInfo userCurrency={userCurrency} />
          <CategoriesInfo availableDates={availableDates} userCurrency={userCurrency} />
        </div>
      </div>
    </div>
  );
};

export default Analytics;
