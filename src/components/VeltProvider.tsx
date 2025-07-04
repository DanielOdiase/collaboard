'use client';

import { VeltProvider as BaseVeltProvider } from '@veltdev/react';
import { ReactNode, useState, useEffect } from 'react';

export function VeltProvider({ children }: { children: ReactNode }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <>{children}</>;
  }

  const apiKey = process.env.NEXT_PUBLIC_VELT_API_KEY;
  
  if (!apiKey) {
    console.warn('Velt API key not found. Velt features will be disabled.');
    return <>{children}</>;
  }

  return (
    <BaseVeltProvider apiKey={apiKey}>
      {children}
    </BaseVeltProvider>
  );
} 