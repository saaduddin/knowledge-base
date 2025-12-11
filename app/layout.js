import { PagesTopLoader } from 'nextjs-toploader/pages';
import { Toaster } from 'react-hot-toast';
import "@/styles/globals.css";

export const metadata = {
  title: 'Demo Foru.ms',
  description: 'A Next.js forum application',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head />
      <body>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:bg-blue-600 focus:text-white focus:px-4 focus:py-2 focus:m-2 focus:rounded"
        >
          Skip to main content
        </a>
        <PagesTopLoader color="rgb(29 78 216)" />
        <Toaster />
        {children}
      </body>
    </html>
  );
}
