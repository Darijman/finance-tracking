'use client';

import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import './subMenuButton.css';
import './responsive.css';

interface Props {
  iconSrc: React.FC<React.SVGProps<SVGSVGElement>>;
  label: string;
  href?: string;
  onClick?: React.MouseEventHandler;
  navigation?: boolean;
}

export const SubMenuButton = ({ iconSrc: Icon, label, href, onClick, navigation }: Props) => {
  const router = useRouter();
  const pathName = usePathname();

  const isActive = pathName === href;

  return (
    <>
      {navigation && href ? (
        <button
          className={`submenu_button ${isActive ? 'active' : ''}`}
          onClick={(e) => {
            if (onClick) onClick(e);
            router.push(href);
          }}
        >
          <Icon className={`submenu_icon ${isActive ? 'active' : ''}`} />
          <span className={`submenu_button_text ${isActive ? 'active' : ''}`}>{label}</span>
        </button>
      ) : (
        <button className='submenu_button' onClick={onClick}>
          <Icon className='submenu_icon' />
          <span className='submenu_button_text'>{label}</span>
        </button>
      )}
    </>
  );
};
