'use client';

import './profile.css';
import { UserInfo } from './userInfo/UserInfo';

const Profile = () => {
  return (
    <div className='profile_container'>
      <h1 style={{ textAlign: 'center' }}>Profile</h1>
      <UserInfo />
    </div>
  );
};

export default Profile;
