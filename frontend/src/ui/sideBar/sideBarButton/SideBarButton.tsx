'use client';

import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import './sideBarButton.css';

interface Props {
  iconSrc: React.FC<React.SVGProps<SVGSVGElement>>;
  label: string;
  href?: string;
  onClick?: React.MouseEventHandler;
  navigation?: boolean;
}

export const SideBarButton = ({ iconSrc: Icon, label, href, navigation, onClick }: Props) => {
  const router = useRouter();
  const pathName = usePathname();

  const isActive = pathName === href;

  return (
    <>
      {navigation && href ? (
        <button className={`sidebar_button${isActive ? ' active' : ''}`} onClick={() => router.push(href)}>
          <Icon
            className='icon'
            style={{ stroke: isActive ? 'black' : 'white', strokeWidth: isActive ? 1 : 0, fill: isActive ? 'black' : 'white' }}
          />
          <span className='sidebar_button_text' style={{ fontWeight: isActive ? 'bold' : 'normal', fontSize: isActive ? '16px' : '15px' }}>
            {label}
          </span>
        </button>
      ) : (
        <button className='sidebar_button' onClick={onClick}>
          <Icon className='icon' />
          <span className='sidebar_button_text'>{label}</span>
        </button>
      )}
    </>
  );
};
