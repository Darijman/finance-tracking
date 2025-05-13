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

export const UserInfo = () => {
  const [userInfo, setUserInfo] = useState<FullUser | null>(null);
  const [userFinanceNotes, setUserFinanceNotes] = useState<FinanceNote[]>([]);
  const { user } = useAuth();

  const getUserInfo = useCallback(async () => {
    if (user.id) {
      const response = await api.get<FullUser>(`/users/${user.id}`);
      setUserInfo(response.data);
    }
  }, [user.id]);

  const getNotesByUserId = useCallback(async () => {
    if (user.id) {
      const response = await api.get<FinanceNote[]>(`/finance_notes/user/${user.id}`);
      setUserFinanceNotes(response.data);
    }
  }, [user.id]);

  useEffect(() => {
    getUserInfo();
    getNotesByUserId();
  }, [getUserInfo, getNotesByUserId]);

  return (
    <div className='user_info'>
      <Title level={2} style={{ textAlign: 'center', margin: '0px 0px 10px 0px' }}>
        Your Info:
      </Title>
      <dl className='userinfo_list'>
        <div className='userinfo_list_item'>
          <dt>Name:</dt>
          <dd>{userInfo?.name}</dd>
        </div>
        <div className='userinfo_list_item'>
          <dt>Email:</dt>
          <dd>{userInfo?.email}</dd>
        </div>
        <div className='userinfo_list_item'>
          <dt>Registration Date:</dt>
          <dd>{userInfo?.createdAt ? formatDate(userInfo.createdAt) : 'N/A'}</dd>
        </div>
        <div className='userinfo_list_item'>
          <dt>Finance-Notes:</dt>
          <dd>{userFinanceNotes.length}</dd>
        </div>
      </dl>
    </div>
  );
};
