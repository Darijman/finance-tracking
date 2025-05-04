import type { Metadata } from 'next';
import { Signika_Negative } from 'next/font/google';
import { ThemeProvider } from '@/providers/themeProvider/ThemeProvider';
import { LoaderProvider } from '@/contexts/loaderContext/LoaderContext';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider } from 'antd';
import { theme } from '@/antdConfig';
import './globals.css';
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
        <ConfigProvider theme={theme}>
          <AntdRegistry>
            <LoaderProvider>
              <ThemeProvider>{children}</ThemeProvider>
            </LoaderProvider>
          </AntdRegistry>
        </ConfigProvider>
      </body>
    </html>
  );
}
