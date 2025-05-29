'use client';

import { Typography } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/contexts/authContext/AuthContext';
import { IAllTimeSummary } from './interfaces';
import api from '../../../../../axiosInstance';
import './allTimeSummary.css';
import './responsive.css';

const { Title } = Typography;

export const AllTimeSummary = () => {
  const { user } = useAuth();
  const [allTimeSummary, setAllTimeSummary] = useState<IAllTimeSummary>({
    incomeTotal: 0,
    expenseTotal: 0,
    balance: 0,
    recentNotes: [],
    noteCount: 0,
  });

  const [hasError, setHasError] = useState<boolean>(false);

  const getAllTimeSummary = useCallback(async () => {
    if (user.id) {
      try {
        setHasError(false);

        const response = await api.get<IAllTimeSummary>(`/finance_notes_summary/all-time/${user.id}`);
        setAllTimeSummary(response.data);
      } catch {
        setHasError(true);
      }
    }
  }, [user.id]);

  useEffect(() => {
    getAllTimeSummary();
  }, [getAllTimeSummary]);

  return (
    <div className='alltime_summary'>
      <Title level={3} style={{ margin: '0px 0px 10px 0px', textAlign: 'center' }}>
        All Time:
      </Title>
      <dl className='alltime_summary_list'>
        {hasError ? (
          <Title level={5} style={{ color: 'var(--red-color)', textAlign: 'center', margin: 0 }}>
            Sorry, data is unavailable
          </Title>
        ) : (
          <>
            <div className='alltime_summary_list_item income'>
              <dt>INCOME TOTAL:</dt>
              <dd>+{allTimeSummary.incomeTotal}</dd>
            </div>
            <div className='alltime_summary_list_item expense'>
              <dt>EXPENSE TOTAL:</dt>
              <dd>-{allTimeSummary.expenseTotal}</dd>
            </div>
            <div className='alltime_summary_list_item'>
              <dt>BALANCE:</dt>
              <dd>{allTimeSummary.balance}</dd>
            </div>
            <div className='alltime_summary_list_item'>
              <dt>NOTES DONE:</dt>
              <dd>{allTimeSummary.noteCount}</dd>
            </div>
          </>
        )}
      </dl>
    </div>
  );
};
