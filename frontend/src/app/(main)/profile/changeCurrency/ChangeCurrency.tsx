'use client';

import { Typography } from 'antd';
import './changeCurrency.css';

const { Title } = Typography;

export const ChangeCurrency = () => {
  return (
    <div className='change_currency'>
      <Title level={2} style={{ textAlign: 'center' }}>
        Currency:
      </Title>
      <div></div>
    </div>
  );
};
