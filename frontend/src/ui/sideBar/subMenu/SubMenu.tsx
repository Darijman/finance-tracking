'use client';

import { SideBarButton } from '../sideBarButton/SideBarButton';
import { useRef, useState } from 'react';
import { SwitchAppearance } from './switchAppearance/SwitchAppearance';
import { useTheme } from '@/contexts/themeContext/ThemeContext';
import { useClickOutside } from '@/hooks/useClickOutside/UseClickOutside';
import './subMenu.css';

interface Props {
  closeSubMenu: () => void;
}

export const SubMenu = ({ closeSubMenu }: Props) => {
  const { theme } = useTheme();
  const [showSwitchAppearance, setShowSwitchAppearance] = useState<boolean>(false);
  const submenuRef = useRef<HTMLDivElement>(null);

  useClickOutside(submenuRef, closeSubMenu);

  return (
    <div ref={submenuRef}>
      {showSwitchAppearance ? (
        <SwitchAppearance closeSwitchApperance={() => setShowSwitchAppearance(false)} />
      ) : (
        <div className='submenu'>
          <ul className='submenu_list'>
            <li className='submenu_item'>
              <SideBarButton iconSrc='/svg/settings-icon.svg' label='Settings' href='/settings' navigation={true} />
            </li>
            <li className='submenu_item'>
              <SideBarButton
                iconSrc={theme === 'light' ? '/svg/sun-icon.svg' : '/svg/moon-icon.svg'}
                label='Switch appearance'
                navigation={false}
                onClick={() => setShowSwitchAppearance(true)}
              />
            </li>
            <hr />
            <li className='submenu_item'>
              <button className='submenu_button'>Log out</button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};
