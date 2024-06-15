import { NextUIProvider } from '@nextui-org/react';
import '../globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <NextUIProvider>
        <main className="dark text-foreground bg-background">
            <Component {...pageProps} />
        </main>
    </NextUIProvider>
  );
}

export default MyApp;
