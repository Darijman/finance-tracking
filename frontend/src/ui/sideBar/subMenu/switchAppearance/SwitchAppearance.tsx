'use client';

import { useTheme } from '@/contexts/themeContext/ThemeContext';
import Image from 'next/image';
import './switchAppearance.css';

interface Props {
  closeSwitchApperance: () => void;
}

export const SwitchAppearance = ({ closeSwitchApperance }: Props) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className='appearance_container'>
      <div className='appearance_top'>
        <div>
          <button className='close_switch_appearance_button' onClick={closeSwitchApperance}>
            ˂
          </button>
          <span className='appearance_container_title'>Switch appearance</span>
        </div>
        <Image
          className='theme_image'
          src={theme === 'dark' ? '/svg/moon-icon.svg' : '/svg/sun-icon.svg'}
          width={30}
          height={30}
          alt='theme-icon'
        />
      </div>
      <hr />
      <div
        className='toggle_container'
        onClick={(e) => {
          if (!(e.target as HTMLElement).closest('label')) {
            toggleTheme();
          }
        }}
      >
        <span>Dark mode</span>
        <label className='switch_label'>
          <input type='checkbox' onChange={toggleTheme} checked={theme === 'dark'} />
          <span className='slider'></span>
        </label>
      </div>
    </div>
  );
};
