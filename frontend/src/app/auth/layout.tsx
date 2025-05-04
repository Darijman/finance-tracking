'use client';

import { useEffect } from 'react';
import { useTheme } from 'next-themes';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme('dark');
  }, [setTheme]);

  return <main>{children}</main>;
}
