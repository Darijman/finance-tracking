'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import './sideBarButton.css';

interface Props {
  iconSrc: string;
  label: string;
  href?: string;
  onClick?: React.MouseEventHandler;
  navigation?: boolean;
}

export const SideBarButton = ({ iconSrc, label, href, navigation, onClick }: Props) => {
  const router = useRouter();

  return (
    <>
      {navigation && href ? (
        <button className='sidebar_button' onClick={() => router.push(href)}>
          <Image className='sidebar_button_image' src={iconSrc} alt={label} width={30} height={30} />
          <span className='sidebar_button_text'>{label}</span>
        </button>
      ) : (
        <button className='sidebar_button' onClick={onClick}>
          <Image className='sidebar_button_image' src={iconSrc} alt={label} width={30} height={30} />
          <span className='sidebar_button_text'>{label}</span>
        </button>
      )}
    </>
  );
};
