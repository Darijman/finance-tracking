import type { Metadata } from 'next';
import { Signika_Negative } from 'next/font/google';
import { ThemeProvider } from '@/providers/themeProvider/ThemeProvider';
import { SideBar } from '@/ui/sideBar/SideBar';
import './globals.css';

const signika_negative = Signika_Negative({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Finance-Tracking',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body className={signika_negative.className}>
        <ThemeProvider>
          <SideBar />
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
