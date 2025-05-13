'use client';

import { Typography } from 'antd';
import { MonthsInfo } from './monthsInfo/MonthsInfo';
import { CategoriesInfo } from './categoriesInfo/CategoriesInfo';
import { MonthSummary } from './monthSummary/MonthSummary';
import { AllTimeSummary } from './allTimeSummary/AllTimeSummary';
import './analytics.css';

const { Title } = Typography;

const Analytics = () => {
  return (
    <div>
      <Title level={1} style={{ textAlign: 'center', margin: '0px 0px 20px 0px' }}>
        Analytics
      </Title>
      <div className='analytics_main'>
        <div className='analytics_summary'>
          <MonthSummary />
          <AllTimeSummary />
        </div>
        <div>
          <MonthsInfo />
          <CategoriesInfo />
        </div>
      </div>
    </div>
  );
};

export default Analytics;
