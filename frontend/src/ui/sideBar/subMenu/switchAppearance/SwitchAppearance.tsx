'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import SunIcon from '@/assets/svg/sun-icon.svg';
import MoonIcon from '@/assets/svg/moon-icon.svg';
import './switchAppearance.css';

interface Props {
  closeSwitchApperance: () => void;
}

export const SwitchAppearance = ({ closeSwitchApperance }: Props) => {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDarkMode = resolvedTheme === 'dark';

  return (
    <div className='appearance_container'>
      <div className='appearance_top'>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button className='close_switch_appearance_button' onClick={closeSwitchApperance}>
            ˂
          </button>
          <span className='appearance_container_title'>Switch appearance</span>
        </div>
        {isDarkMode ? <MoonIcon className='theme_image' /> : <SunIcon className='theme_image' />}
      </div>
      <hr />
      <div
        className='toggle_container'
        onClick={(e) => {
          if (!(e.target as HTMLElement).closest('label')) {
            setTheme(isDarkMode ? 'light' : 'dark');
          }
        }}
      >
        <span>Dark mode</span>
        <label className='switch_label'>
          <input type='checkbox' onChange={() => setTheme(isDarkMode ? 'light' : 'dark')} checked={isDarkMode} />
          <span className='slider'></span>
        </label>
      </div>
    </div>
  );
};
