'use client';

import { Typography } from 'antd';
import { MonthSummary } from './monthSummary/MonthSummary';
import { AllTimeSummary } from './allTimeSummary/AllTimeSummary';
import './home.css';

const { Title } = Typography;

export default function Home() {
  return (
    <div>
      <Title level={1} style={{ textAlign: 'center', margin: '0px 0px 20px 0px' }}>
        Home
      </Title>
      <div className='home_main'>
        <MonthSummary />
        <AllTimeSummary />
      </div>
    </div>
  );
}
