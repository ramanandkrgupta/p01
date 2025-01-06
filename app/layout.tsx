import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Navbar } from '@/components/navbar';
import { Toaster } from '@/components/ui/toaster';
import { ClerkProvider } from '@clerk/nextjs';
import { CartProvider } from "@/contexts/cart-context";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Serve Ease - Expert Services at Your Doorstep',
  description: 'Find trusted professionals for home services, beauty, repairs and more.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
    <html lang="en" suppressHydrationWarning>
      <head>
          
          <script
            id="otpless-sdk"
            type="text/javascript"
            data-appid="OI4TRZPB9XK0LASY381V"
            src="https://otpless.com/v4/auth.js"
          ></script>
          
                </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <CartProvider>
            {children}
          </CartProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
    </ClerkProvider>
  );
}