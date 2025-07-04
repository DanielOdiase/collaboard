'use client';

import { useState } from 'react';

interface RoomInfoProps {
  roomId: string;
}

export default function RoomInfo({ roomId }: RoomInfoProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}?room=${roomId}`
    : '';

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-xs">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-gray-600">Room:</span>
        <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">
          {roomId.slice(0, 8)}...
        </code>
      </div>
      <button
        onClick={copyToClipboard}
        className="w-full px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs transition-colors"
      >
        {copied ? 'Copied!' : 'Share Room'}
      </button>
    </div>
  );
} 