'use client';

import { useAuth } from '@/contexts/authContext/AuthContext';
import { useCallback, useEffect, useState } from 'react';
import { FullUser } from '@/interfaces/fullUser';
import { formatDate } from '@/helpers/formatDate';
import { FinanceNote } from '@/interfaces/financeNote';
import { Typography } from 'antd';
import api from '../../../../../axiosInstance';
import './userInfo.css';

const { Title } = Typography;

interface Props {
  fullUser: FullUser;
}

export const UserInfo = ({ fullUser }: Props) => {
  const { user } = useAuth();

  const [userFinanceNotes, setUserFinanceNotes] = useState<FinanceNote[]>([]);
  const [serverError, setServerError] = useState<{ error: string }>({ error: '' });

  const getNotesByUserId = useCallback(async () => {
    if (user.id) {
      try {
        const response = await api.get<FinanceNote[]>(`/finance_notes/user/${user.id}`);
        setUserFinanceNotes(response.data);
      } catch (error: any) {
        setServerError(error.response?.data || 'Something went wrong...');
      }
    }
  }, [user.id]);

  useEffect(() => {
    getNotesByUserId();
  }, [getNotesByUserId]);

  return (
    <div className='user_info'>
      <Title level={2} style={{ textAlign: 'center', margin: '0px 0px 10px 0px' }}>
        Your Info:
      </Title>
      <dl className='userinfo_list'>
        {serverError.error ? (
          <Title level={3} style={{ color: 'var(--red-color)', textAlign: 'center' }}>
            {serverError.error}
          </Title>
        ) : (
          <>
            <div className='userinfo_list_item'>
              <dt>Name:</dt>
              <dd>{fullUser.name}</dd>
            </div>
            <div className='userinfo_list_item'>
              <dt>Email:</dt>
              <dd>{fullUser.email}</dd>
            </div>
            <div className='userinfo_list_item'>
              <dt>Registration Date:</dt>
              <dd>{fullUser.createdAt ? formatDate(fullUser.createdAt) : 'N/A'}</dd>
            </div>
            <div className='userinfo_list_item'>
              <dt>Finance-Notes:</dt>
              <dd>{userFinanceNotes.length}</dd>
            </div>
          </>
        )}
      </dl>
    </div>
  );
};
