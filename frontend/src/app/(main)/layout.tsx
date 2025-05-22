'use client';

import { ReactNode } from 'react';
import { SideBar } from '@/ui/sideBar/SideBar';
import { AuthProvider } from '@/contexts/authContext/AuthContext';
import { Footer } from '@/ui/footer/Footer';
import { useIsMobile } from '@/hooks/useIsMobile/UseIsMobile';

import './layout.css';
import { BurgerMenu } from '@/ui/burgerMenu/BurgerMenu';

export default function MainLayout({ children }: { children: ReactNode }) {
  const isMobile = useIsMobile(770);

  return (
    <AuthProvider>
      {isMobile && <BurgerMenu />}
      <div className='layout_container'>
        {!isMobile && <SideBar />}
        <div className='main_layout'>
          <main>{children}</main>
          <Footer />
        </div>
      </div>
    </AuthProvider>
  );
}
