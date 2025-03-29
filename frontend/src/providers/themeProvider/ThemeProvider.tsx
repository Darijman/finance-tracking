'use client';

import { useEffect, useState } from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className='invisible' />;
  }

  return (
    <NextThemesProvider attribute='data-theme' enableSystem defaultTheme='system'>
      {children}
    </NextThemesProvider>
  );
};
