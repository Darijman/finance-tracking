'use client';

import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import './sideBarButton.css';
import './responsive.css';

interface Props {
  iconSrc: React.FC<React.SVGProps<SVGSVGElement>>;
  label: string;
  href?: string;
  onClick?: React.MouseEventHandler;
  navigation?: boolean;
  style?: React.CSSProperties;
  buttonRef?: any;
}

export const SideBarButton = ({ iconSrc: Icon, label, href, onClick, navigation, style, buttonRef }: Props) => {
  const router = useRouter();
  const pathName = usePathname();

  const isActive = pathName === href;

  return (
    <>
      {navigation && href ? (
        <button style={style} ref={buttonRef} className={`sidebar_button ${isActive ? 'active' : ''}`} onClick={() => router.push(href)}>
          <Icon className={`sidebar_icon ${isActive ? 'active' : ''}`} />
          <span className={`sidebar_button_text ${isActive ? 'active' : ''}`}>{label}</span>
        </button>
      ) : (
        <button style={style} ref={buttonRef} className='sidebar_button' onClick={onClick}>
          <Icon className='sidebar_icon' />
          <span className='sidebar_button_text'>{label}</span>
        </button>
      )}
    </>
  );
};
