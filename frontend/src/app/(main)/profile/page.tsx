'use client';

import { Typography } from 'antd';
import { UserInfo } from './userInfo/UserInfo';
import { SelectCurrency } from './selectCurrency/SelectCurrency';
import './profile.css';

const { Title } = Typography;

const Profile = () => {
  return (
    <div className='profile_container'>
      <Title level={1} style={{ textAlign: 'center', margin: '0px 0px 20px 0px' }}>
        Profile
      </Title>
      <div className='profile_main'>
        <UserInfo />
        <SelectCurrency />
      </div>
    </div>
  );
};

export default Profile;
