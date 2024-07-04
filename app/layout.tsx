// app/layout.tsx
import { NextUIProvider } from "@nextui-org/react";
import "./globals.css";
import { StoreProvider } from "./store/context-provider";
import Head from "next/head";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body className="dark min-h-screen">
        <StoreProvider>
          <NextUIProvider>
            <div className="bg-image"></div>
            <div className="overlay"></div>
            <div className="content">
              {children}
            </div>
            </NextUIProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
