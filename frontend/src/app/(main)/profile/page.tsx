'use client';

import { Typography } from 'antd';
import { UserInfo } from './userInfo/UserInfo';
import { ChangeCurrency } from './changeCurrency/ChangeCurrency';
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
        <ChangeCurrency />
      </div>
    </div>
  );
};

export default Profile;
