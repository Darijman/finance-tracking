'use client';

import { useCallback, useEffect, useState } from 'react';
import { Typography, notification } from 'antd';
import { UserInfo } from './userInfo/UserInfo';
import { SelectCurrency } from './selectCurrency/SelectCurrency';
import { useAuth } from '@/contexts/authContext/AuthContext';
import { FullUser } from '@/interfaces/fullUser';
import { Loader } from '@/ui/loader/Loader';
import { useLoader } from '@/contexts/loaderContext/LoaderContext';
import api from '../../../../axiosInstance';
import './profile.css';
import './responsive.css';

const { Title } = Typography;

const Profile = () => {
  const { user } = useAuth();
  const { isLoading, hideLoader, showLoader } = useLoader();

  const [fullUser, setFullUser] = useState<FullUser>({
    id: 0,
    name: '',
    email: '',
    currencyId: 0,
    roleId: 0,
    createdAt: '',
    updatedAt: '',
  });

  const [hasError, setHasError] = useState<boolean>(false);
  const [notificationApi, contextHolder] = notification.useNotification({
    maxCount: 2,
    placement: 'top',
    duration: 5,
  });

  const getFullUser = useCallback(async () => {
    if (user.id) {
      try {
        showLoader();
        setHasError(false);

        const response = await api.get<FullUser>(`/users/${user.id}`);
        setFullUser(response.data);
      } catch {
        setHasError(true);
      } finally {
        hideLoader();
      }
    }
  }, [user.id, showLoader, hideLoader]);

  useEffect(() => {
    getFullUser();
  }, [getFullUser]);

  useEffect(() => {
    if (hasError) {
      notificationApi.error({
        message: 'Something went wrong..',
        description: 'We couldn’t load your profile. Please try again later.',
      });
    }
  }, [hasError, notificationApi]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className='profile_container'>
      {contextHolder}
      <Title level={1} style={{ textAlign: 'center', margin: '0px 0px 20px 0px' }}>
        Profile
      </Title>
      {hasError ? (
        <div style={{ textAlign: 'center', color: 'var(--secondary-text-color)' }}>Failed to load profile data.</div>
      ) : (
        <div className='profile_main'>
          <UserInfo fullUser={fullUser} />
          <SelectCurrency fullUser={fullUser} setFullUser={setFullUser} />
        </div>
      )}
    </div>
  );
};

export default Profile;
