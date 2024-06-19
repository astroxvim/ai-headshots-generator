// app/layout.tsx
import { NextUIProvider } from '@nextui-org/react';
import ReactDOM from "react-dom/client";
import { cn } from '../utils/cn';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className='dark min-h-screen'>
        <NextUIProvider>
          {children}
        </NextUIProvider>
      </body>
    </html>
  );
}
