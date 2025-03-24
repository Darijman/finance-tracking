'use client';

import { SideBarButton } from '../sideBarButton/SideBarButton';
import { useRef, useState } from 'react';
import { SwitchAppearance } from './switchAppearance/SwitchAppearance';
import { useTheme } from 'next-themes';
import { useClickOutside } from '@/hooks/useClickOutside/UseClickOutside';
import SettingsIcon from '@/assets/svg/settings-icon.svg';
import SunIcon from '@/assets/svg/sun-icon.svg';
import MoonIcon from '@/assets/svg/moon-icon.svg';
import './subMenu.css';

interface Props {
  closeSubMenu: () => void;
  buttonRef: React.RefObject<HTMLButtonElement>;
}

export const SubMenu = ({ closeSubMenu, buttonRef }: Props) => {
  const { theme } = useTheme();
  const [showSwitchAppearance, setShowSwitchAppearance] = useState<boolean>(false);
  const subMenuRef = useRef<HTMLDivElement>(null);

  useClickOutside(subMenuRef, closeSubMenu, buttonRef);

  return (
    <div ref={subMenuRef}>
      {showSwitchAppearance ? (
        <SwitchAppearance closeSwitchApperance={() => setShowSwitchAppearance(false)} />
      ) : (
        <div className='submenu'>
          <ul className='submenu_list'>
            <li className='submenu_item'>
              <SideBarButton iconSrc={SettingsIcon} label='Settings' href='/settings' navigation={true} />
            </li>
            <li className='submenu_item'>
              <SideBarButton
                iconSrc={theme === 'light' ? SunIcon : MoonIcon}
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
