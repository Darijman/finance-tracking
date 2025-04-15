'use client';

import { ReactNode } from 'react';
import { SideBar } from '@/ui/sideBar/SideBar';
import { AuthProvider } from '@/contexts/authContext/AuthContext';
import { Footer } from '@/ui/footer/Footer';

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <SideBar />
      {/* <div> */}
        <main>{children}</main>
        {/* <Footer /> */}
      {/* </div> */}
    </AuthProvider>
  );
}
