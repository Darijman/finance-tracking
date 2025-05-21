'use client';

import { useCallback, useEffect, useState } from 'react';
import { Typography } from 'antd';
import { UserInfo } from './userInfo/UserInfo';
import { SelectCurrency } from './selectCurrency/SelectCurrency';
import { useAuth } from '@/contexts/authContext/AuthContext';
import { FullUser } from '@/interfaces/fullUser';
import api from '../../../../axiosInstance';
import './profile.css';
import './responsive.css';

const { Title } = Typography;

const Profile = () => {
  const { user } = useAuth();
  const [fullUser, setFullUser] = useState<FullUser>({
    id: 0,
    name: '',
    email: '',
    currencyId: 0,
    roleId: 0,
    createdAt: '',
    updatedAt: '',
  });

  const getFullUser = useCallback(async () => {
    if (user.id) {
      const response = await api.get<FullUser>(`/users/${user.id}`);
      setFullUser(response.data);
    }
  }, [user.id]);

  useEffect(() => {
    getFullUser();
  }, [getFullUser]);

  return (
    <div className='profile_container'>
      <Title level={1} style={{ textAlign: 'center', margin: '0px 0px 20px 0px' }}>
        Profile
      </Title>
      <div className='profile_main'>
        <UserInfo fullUser={fullUser} />
        <SelectCurrency fullUser={fullUser} setFullUser={setFullUser} />
      </div>
    </div>
  );
};

export default Profile;
