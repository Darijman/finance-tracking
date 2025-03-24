'use client';

import { useMemo, useRef, useState } from 'react';
import { SideBarButton } from './sideBarButton/SideBarButton';
import { SubMenu } from './subMenu/SubMenu';
import { icons, sideBarButtons } from './sideBarConfig';
import BurgerMenuIcon from '@/assets/svg/burgerMenu-icon.svg';
import './sideBar.css';

export const SideBar = () => {
  const [showSubmenu, setShowSubmenu] = useState<boolean>(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const menuItems = useMemo(
    () =>
      sideBarButtons.map(({ iconKey, label, href, navigation }) => {
        const IconComponent = icons[iconKey];

        return (
          <li className='sidebar_item' key={href}>
            <SideBarButton iconSrc={IconComponent} label={label} href={href} navigation={navigation} />
          </li>
        );
      }),
    [],
  );

  return (
    <aside className='sidebar'>
      <h2 className='sidebar_title'>Finance-Tracking</h2>
      <nav className='sidebar_nav'>
        <ul className='sidebar_list'>{menuItems}</ul>

        {showSubmenu && <SubMenu closeSubMenu={() => setShowSubmenu((prev) => !prev)} buttonRef={buttonRef} />}

        <button ref={buttonRef} className='sidebar_more_button' onClick={() => setShowSubmenu((prev) => !prev)}>
          <BurgerMenuIcon className='icon' />
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
