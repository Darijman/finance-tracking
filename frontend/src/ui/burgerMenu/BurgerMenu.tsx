'use client';

import { useRef, useState } from 'react';
import { BurgerNavigationList } from './burgerNavigationList/BurgerNavigationList';
import { SideBarButton } from '../sideBar/sideBarButton/SideBarButton';
import './burgerMenu.css';

import BurgerMenuIcon from '@/assets/svg/burgerMenu-icon.svg';

export const BurgerMenu = () => {
  const [showNavigation, setShowNavigation] = useState<boolean>(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <div className='burger_menu_container'>
      <SideBarButton
        iconSrc={BurgerMenuIcon}
        label=''
        navigation={false}
        onClick={() => setShowNavigation((prev) => !prev)}
        style={{ backgroundColor: showNavigation ? 'var(--foreground-color)' : 'transparent', marginBottom: 5 }}
        buttonRef={buttonRef}
      />
      {showNavigation ? <BurgerNavigationList onClick={() => setShowNavigation(false)} buttonRef={buttonRef} /> : null}
    </div>
  );
};
