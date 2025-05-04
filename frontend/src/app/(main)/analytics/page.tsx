'use client';

import { Typography } from 'antd';
import { MonthsInfo } from './monthsInfo/MonthsInfo';
import { CategoriesInfo } from './categoriesInfo/CategoriesInfo';
import './analytics.css';

const { Title } = Typography;

const Analytics = () => {
  return (
    <div>
      <Title level={1} style={{ textAlign: 'center', margin: '0px 0px 20px 0px' }}>
        Analytics
      </Title>
      <div className='analytics_main'>
        <MonthsInfo />
        <CategoriesInfo />
      </div>
    </div>
  );
};

export default Analytics;
