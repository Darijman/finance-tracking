'use client';

import { ReactNode } from 'react';
import { SideBar } from '@/ui/sideBar/SideBar';
import { AuthProvider } from '@/contexts/authContext/AuthContext';

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <SideBar />
      <main>{children}</main>
    </AuthProvider>
  );
}
