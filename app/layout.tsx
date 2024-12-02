import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/toaster";
import SuppressConsole from "@/components/SuppressConsole";
import '@stream-io/video-react-sdk/dist/css/styles.css';
import 'react-datepicker/dist/react-datepicker.css';
import { ruRU } from "@clerk/localizations";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "UzrokCam",
  description: "Video calling app",
  icons: {
    icon: '/icons/logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <ClerkProvider localization={ruRU} appearance={{
        layout: {
          logoImageUrl: '/icons/yoom-logo.png',
          socialButtonsVariant: 'iconButton',
        },
        variables: {
          colorText: '#fff',
          colorPrimary: '#0E78F9',
          colorBackground: '#1c1f2e',
          colorInputBackground: '#252a41',
          colorInputText: '#fff',
        },
      }}>
        <body
          className={`${geistSans.variable} ${geistMono.variable} bg-dark-2 antialiased`}
        >
          <SuppressConsole />
          {children}
          <Toaster />
        </body>
      </ClerkProvider>
    </html>
  );
}
