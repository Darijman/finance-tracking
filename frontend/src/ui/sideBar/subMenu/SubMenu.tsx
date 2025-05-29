'use client';

import { SubMenuButton } from './subMenuButton/SubMenuButton';
import { useRef, useState } from 'react';
import { SwitchAppearance } from './switchAppearance/SwitchAppearance';
import { useTheme } from 'next-themes';
import { useClickOutside } from '@/hooks/useClickOutside/UseClickOutside';
import { useAuth } from '@/contexts/authContext/AuthContext';
import { useRouter } from 'next/navigation';
import { DeleteModal } from '@/components/deleteModal/DeleteModal';
import api from '../../../../axiosInstance';
import './subMenu.css';

import SettingsIcon from '@/assets/svg/settings-icon.svg';
import SunIcon from '@/assets/svg/sun-icon.svg';
import MoonIcon from '@/assets/svg/moon-icon.svg';

interface Props {
  closeSubMenu: () => void;
  buttonRef: React.RefObject<HTMLButtonElement>;
  switchAppearanceStyle: React.CSSProperties;
  subMenuStyle: React.CSSProperties;
}

export const SubMenu = ({ closeSubMenu, buttonRef, switchAppearanceStyle, subMenuStyle }: Props) => {
  const { theme } = useTheme();
  const { setUser } = useAuth();
  const router = useRouter();

  const [showSwitchAppearance, setShowSwitchAppearance] = useState<boolean>(false);
  const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false);
  const subMenuRef = useRef<HTMLDivElement>(null);

  useClickOutside(subMenuRef, closeSubMenu, buttonRef);

  const logOutUser = async () => {
    await api.post(`/auth/logout`);
    setUser({ id: 0 });
    router.push(`/auth/login`);
  };

  return (
    <div ref={subMenuRef}>
      {showSwitchAppearance ? (
        <SwitchAppearance style={switchAppearanceStyle} closeSwitchApperance={() => setShowSwitchAppearance(false)} />
      ) : (
        <div className='submenu' style={subMenuStyle}>
          <ul className='submenu_list'>
            <li className='submenu_item'>
              <SubMenuButton iconSrc={SettingsIcon} label='Settings' href='/settings' navigation={true} />
            </li>
            <li className='submenu_item'>
              <SubMenuButton
                iconSrc={theme === 'light' ? SunIcon : MoonIcon}
                label='Switch appearance'
                navigation={false}
                onClick={() => setShowSwitchAppearance(true)}
              />
            </li>
            <hr />
            <li className='submenu_item'>
              <button
                className='submenu_button'
                onClick={() => {
                  // closeSubMenu();
                  setShowLogoutModal(true);
                }}
              >
                Log out
              </button>
            </li>
          </ul>
        </div>
      )}
      <DeleteModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onDelete={logOutUser}
        text='You’re about to be signed out. Continue?'
        deleteButtonText='Yes, sign out!'
      />
    </div>
  );
};
