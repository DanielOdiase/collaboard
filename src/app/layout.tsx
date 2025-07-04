// src/app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';


export const metadata: Metadata = {
  title: 'CollabBoard',
  description: 'Real-time collaborative notes app',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
