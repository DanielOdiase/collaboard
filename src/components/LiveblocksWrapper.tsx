// src/components/LiveblocksWrapper.tsx
'use client';

import { LiveblocksProvider } from '@liveblocks/react';

export default function LiveblocksWrapper({ children }: { children: React.ReactNode }) {
  return (
    <LiveblocksProvider publicApiKey="pk_dev_ikGtDSHCJmrLlmPXItAmdykDZwW9RRD2ZQU5xIRnF10YvYtM8Dlj71Dr3od8VD5p">
      {children}
    </LiveblocksProvider>
  );
}
