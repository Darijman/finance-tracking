'use client';

import { icons, sideBarButtons } from '@/ui/sideBar/sideBarConfig';
import { SubMenuButton } from '@/ui/sideBar/subMenu/subMenuButton/SubMenuButton';
import { useRef, useState } from 'react';
import { useClickOutside } from '@/hooks/useClickOutside/UseClickOutside';
import { SubMenu } from '@/ui/sideBar/subMenu/SubMenu';
import './burgerNavigationList.css';

import MoreIcon from '@/assets/svg/more-icon.svg';

interface Props {
  onClick: () => void;
  buttonRef: React.RefObject<HTMLButtonElement>;
}

export const BurgerNavigationList = ({ onClick, buttonRef }: Props) => {
  const burgerNavigationListRef = useRef<any | null>(null);
  const [showSubmenu, setShowSubmenu] = useState<boolean>(false);

  const closeMenu = () => {
    onClick();
  };

  useClickOutside(burgerNavigationListRef, closeMenu, buttonRef);

  return (
    <div className='burger_navigation_list_container' ref={burgerNavigationListRef}>
      {showSubmenu ? (
        <SubMenu
          switchAppearanceStyle={{ position: 'fixed', right: '20px' }}
          subMenuStyle={{ position: 'fixed', right: '20px' }}
          closeSubMenu={() => setShowSubmenu((prev) => !prev)}
          buttonRef={buttonRef}
        />
      ) : (
        <ul className='burger_navigation_list'>
          <>
            {sideBarButtons.map(({ iconKey, label, href, navigation }) => {
              const IconComponent = icons[iconKey];

              return (
                <li className='sidebar_item' key={href}>
                  <SubMenuButton iconSrc={IconComponent} label={label} href={href} navigation={navigation} onClick={onClick} />
                </li>
              );
            })}
            <li className='submenu_item'>
              <SubMenuButton iconSrc={MoreIcon} label='More' navigation={false} onClick={() => setShowSubmenu(true)} />
            </li>
          </>
        </ul>
      )}
    </div>
  );
};
