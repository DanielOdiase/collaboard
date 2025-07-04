'use client';

import { LiveblocksProvider } from '@liveblocks/react';

export default function LiveblocksRoot({ children }: { children: React.ReactNode }) {
  const apiKey = process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY ||
    "pk_dev_ikGtDSHCJmrLlmPXItAmdykDZwW9RRD2ZQU5xIRnF10YvYtM8Dlj71Dr3od8VD5p";

  return (
    <LiveblocksProvider publicApiKey={apiKey}>
      {children}
    </LiveblocksProvider>
  );
} 