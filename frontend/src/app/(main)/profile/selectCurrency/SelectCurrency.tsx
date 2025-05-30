'use client';

import { Button, message, Typography } from 'antd';
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';
import { Currency } from '@/interfaces/currency';
import { useAuth } from '@/contexts/authContext/AuthContext';
import { FullUser } from '@/interfaces/fullUser';
import api from '../../../../../axiosInstance';
import './selectCurrency.css';
import './responsive.css';

const { Title } = Typography;

interface Props {
  fullUser: FullUser;
  setFullUser: Dispatch<SetStateAction<FullUser>>;
}

export const SelectCurrency = ({ fullUser, setFullUser }: Props) => {
  const { user } = useAuth();
  const [allCurrencies, setAllCurrencies] = useState<Currency[]>([]);

  const [messageApi, contextHolder] = message.useMessage({ maxCount: 1 });
  const [selectedCurrencyId, setSelectedCurrencyId] = useState<number>(0);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const [hasError, setHasError] = useState<boolean>(false);

  const getAllCurrencies = useCallback(async () => {
    if (user.id) {
      try {
        const response = await api.get<Currency[]>(`/currencies`);
        setAllCurrencies(response.data);
      } catch {
        setHasError(true);
      }
    }
  }, [user.id]);

  useEffect(() => {
    getAllCurrencies();
  }, [getAllCurrencies]);

  useEffect(() => {
    if (fullUser?.currencyId) {
      setSelectedCurrencyId(fullUser?.currencyId);
    }
  }, [fullUser.currencyId]);

  const currencyOnSaveHandler = async () => {
    if (user.id) {
      try {
        setIsSaving(true);

        await api.patch(`/users/${user.id}/currency`, { currencyId: selectedCurrencyId });
        setFullUser((prevState) => ({ ...prevState, currencyId: selectedCurrencyId }));

        messageApi.open({
          type: 'success',
          content: 'Your currency has been changed!',
        });
      } catch {
        messageApi.open({
          type: 'error',
          content: 'Failed to change currency. Please try again later.',
        });
      } finally {
        setIsSaving(false);
      }
    }
  };

  const saveButtonDisabled = fullUser?.currencyId === selectedCurrencyId || !selectedCurrencyId;

  return (
    <div className='select_currency'>
      {contextHolder}
      <Title level={2} style={{ textAlign: 'center', margin: '0px 0px 10px 0px' }}>
        Select Currency:
      </Title>
      <div className='currency_container'>
        {hasError ? (
          <Title level={5} style={{ color: 'var(--red-color)', margin: 0, textAlign: 'center' }}>
            Failed to load currencies data.
          </Title>
        ) : (
          <ul className='currency_list'>
            {allCurrencies.map((currency) => (
              <li
                key={currency.code}
                className={`currency_list_item ${selectedCurrencyId === currency.id ? 'selected' : ''}`}
                onClick={() => setSelectedCurrencyId(currency.id)}
              >
                <span className='flag'>{currency.flag}</span>
                <span className='code'>{currency.code}</span>
                <span className='symbol'>{currency.symbol}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className='currency_bottom'>
        <Button
          className='currency_save_button'
          type='primary'
          disabled={saveButtonDisabled}
          loading={isSaving}
          onClick={currencyOnSaveHandler}
        >
          Save Currency
        </Button>
      </div>
    </div>
  );
};
