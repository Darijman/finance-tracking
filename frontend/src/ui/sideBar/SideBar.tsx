'use client';

import { useMemo, useRef, useState } from 'react';
import { SideBarButton } from './sideBarButton/SideBarButton';
import { SubMenu } from './subMenu/SubMenu';
import { icons, sideBarButtons } from './sideBarConfig';
import Link from 'next/link';
import BurgerMenuIcon from '@/assets/svg/burgerMenu-icon.svg';
import './sideBar.css';
import './responsive.css';

export const SideBar = () => {
  const [showSubmenu, setShowSubmenu] = useState<boolean>(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

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
      <Link href='/' className='sidebar_app_title'>
        Finance-Tracking
      </Link>
      <nav className='sidebar_nav'>
        <ul className='sidebar_list'>{menuItems}</ul>

        {showSubmenu && (
          <SubMenu
            switchAppearanceStyle={{ position: 'fixed', bottom: '70px' }}
            subMenuStyle={{ position: 'fixed', bottom: '70px' }}
            closeSubMenu={() => setShowSubmenu((prev) => !prev)}
            buttonRef={buttonRef}
          />
        )}

        <SideBarButton
          iconSrc={BurgerMenuIcon}
          label='More'
          navigation={false}
          onClick={() => setShowSubmenu((prev) => !prev)}
          buttonRef={buttonRef}
        />
      </nav>
    </aside>
  );
};
