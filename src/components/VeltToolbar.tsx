'use client';

import { VeltCommentTool, VeltNotificationsTool } from '@veltdev/react';
import { useState, useEffect } from 'react';

export function VeltToolbar() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-3 z-40 flex flex-col space-y-2">
      <div className="w-10 h-10 flex items-center justify-center">
        <VeltCommentTool />
      </div>
      <div className="w-10 h-10 flex items-center justify-center">
        <VeltNotificationsTool />
      </div>
    </div>
  );
} 