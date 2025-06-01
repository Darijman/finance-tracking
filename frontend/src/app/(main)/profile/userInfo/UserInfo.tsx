'use client';

import { useAuth } from '@/contexts/authContext/AuthContext';
import { useCallback, useEffect, useState } from 'react';
import { FullUser } from '@/interfaces/fullUser';
import { formatDate } from '@/helpers/formatDate';
import { Typography } from 'antd';
import api from '../../../../../axiosInstance';
import './userInfo.css';
import './responsive.css';

const { Title } = Typography;

interface Props {
  fullUser: FullUser;
}

export const UserInfo = ({ fullUser }: Props) => {
  const { user } = useAuth();

  const [userFinanceNotesCount, setUserFinanceNotesCount] = useState<{ count: number }>({
    count: 0,
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [serverError, setServerError] = useState<{ error: string }>({ error: '' });

  const getUserNotesCount = useCallback(async () => {
    if (user.id) {
      try {
        setIsLoading(true);

        const response = await api.get<{ count: number }>(`/finance_notes/user/${user.id}/count`);
        setUserFinanceNotesCount(response.data);
      } catch (error: any) {
        setServerError(error.response?.data || 'Something went wrong...');
      } finally {
        setIsLoading(false);
      }
    }
  }, [user.id]);

  useEffect(() => {
    getUserNotesCount();
  }, [getUserNotesCount]);

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
              <dd>
                {isLoading ? (
                  <div style={{ color: 'var(--secondary-text-color)' }}>Loading..</div>
                ) : (
                  userFinanceNotesCount.count.toLocaleString('ru-RU')
                )}
              </dd>
            </div>
          </>
        )}
      </dl>
    </div>
  );
};
