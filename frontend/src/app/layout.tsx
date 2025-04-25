import type { Metadata } from 'next';
import { Signika_Negative } from 'next/font/google';
import { ThemeProvider } from '@/providers/themeProvider/ThemeProvider';
import './globals.css';
import { LoaderProvider } from '@/contexts/loaderContext/LoaderContext';
import '@ant-design/v5-patch-for-react-19';

const signika_negative = Signika_Negative({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Finance-Tracking',
  icons: {
    icon: '/favicon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body className={signika_negative.className}>
        <LoaderProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </LoaderProvider>
      </body>
    </html>
  );
}
