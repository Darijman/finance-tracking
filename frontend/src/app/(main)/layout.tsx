'use client';

import { ReactNode, useEffect } from 'react';
import { SideBar } from '@/ui/sideBar/SideBar';
import { AuthProvider } from '@/contexts/authContext/AuthContext';
import { Footer } from '@/ui/footer/Footer';
import { useIsMobile } from '@/hooks/useIsMobile/UseIsMobile';
import { BurgerMenu } from '@/ui/burgerMenu/BurgerMenu';
import { useRouter } from 'next/navigation';
import { emitter } from '@/events';
import './layout.css';
import api from '../../../axiosInstance';

export default function MainLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const isMobile: boolean = useIsMobile(770);

  useEffect(() => {
    emitter.on('logout', async () => {
      await api.post(`/auth/logout`);
      router.push(`/auth/login`);
    });
    return () => {
      emitter.off('logout');
    };
  }, [router]);

  return (
    <AuthProvider>
      {isMobile && <BurgerMenu />}
      <div className='layout_container'>
        {!isMobile && <SideBar />}
        <div className='main_layout' id='scrollableMainLayout'>
          <main>{children}</main>
          <Footer />
        </div>
      </div>
    </AuthProvider>
  );
}
