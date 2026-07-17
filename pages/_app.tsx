import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { ThemeProvider } from '../components/ThemeProvider';
import Layout from '../components/Layout';
import { Toaster } from 'react-hot-toast';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className={`${plusJakartaSans.variable} font-sans`}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
        <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      </div>
    </ThemeProvider>
  );
}