'use client';

import { SideBarButton } from './sideBarButton/SideBarButton';
import { useState } from 'react';
import { SubMenu } from './subMenu/SubMenu';
import Image from 'next/image';
import './sideBar.css';

const sideBarButtons: {
  iconSrc: string;
  label: string;
  href: string;
  navigation?: boolean;
  onClick?: React.MouseEventHandler;
}[] = [
  { iconSrc: '/svg/home-icon.svg', label: 'Home', href: '/', navigation: true },
  { iconSrc: '/svg/addAction-icon.svg', label: 'Add Action', href: '/addAction', navigation: true },
  { iconSrc: '/svg/history-icon.svg', label: 'History', href: '/history', navigation: true },
  { iconSrc: '/svg/analytics-icon.svg', label: 'Analytics', href: '/analytics', navigation: true },
  { iconSrc: '/svg/wallet-icon.svg', label: 'Balance', href: '/balance', navigation: true },
  { iconSrc: '/svg/profile-icon.svg', label: 'Profile', href: '/profile', navigation: true },
];

export const SideBar = () => {
  const [showSubmenu, setShowSubmenu] = useState<boolean>(false);

  return (
    <aside className='sidebar'>
      <h2 className='sidebar_title'>Finance-Tracking</h2>
      <nav className='sidebar_nav'>
        <ul className='sidebar_list'>
          {sideBarButtons.map((button, index) => {
            return (
              <li className='sidebar_item' key={index}>
                <SideBarButton iconSrc={button.iconSrc} label={button.label} href={button.href} navigation={button.navigation} />
              </li>
            );
          })}
        </ul>
        {showSubmenu && <SubMenu closeSubMenu={() => setShowSubmenu(false)} />}

        <button className='sidebar_more_button' onClick={() => setShowSubmenu((prev) => !prev)}>
          <Image
            className='sidebar_button_image'
            src='/svg/burgerMenu-icon.svg'
            alt='burgerMenu'
            width={showSubmenu ? 32 : 30}
            height={showSubmenu ? 32 : 30}
          />
          <span
            className='sidebar_button_text'
            style={{ fontWeight: showSubmenu ? 'bold' : 'normal', fontSize: showSubmenu ? '16px' : '15px' }}
          >
            More
          </span>
        </button>
      </nav>
    </aside>
  );
};
