'use client';

import { Typography } from 'antd';
import { currencies } from './currencies';
import { useState } from 'react';
import './selectCurrency.css';

const { Title } = Typography;

export const SelectCurrency = () => {
  const [selectedCurrency, setSelectedCurrency] = useState<string>('');

  return (
    <div className='select_currency'>
      <Title level={2} style={{ textAlign: 'center', margin: '0px 0px 10px 0px' }}>
        Select Currency:
      </Title>
      <div className='currency_container'>
        <ul className='currency_list'>
          {currencies.map((currency) => (
            <li
              key={currency.code}
              className={`currency_list_item ${selectedCurrency === currency.code ? 'selected' : ''}`}
              onClick={() => setSelectedCurrency(currency.code)}
            >
              <span className='flag'>{currency.flag}</span>
              <span className='code'>{currency.code}</span>
              <span className='symbol'>{currency.symbol}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
