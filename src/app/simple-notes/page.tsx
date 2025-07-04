'use client';

import {
  LiveblocksProvider,
  RoomProvider,
} from '@liveblocks/react';
import { LiveList } from '@liveblocks/client';
import NotesBoard from '@/components/NotesBoard';

export default function SimpleNotesPage() {
  const apiKey = process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY || 
                 "pk_dev_ikGtDSHCJmrLlmPXItAmdykDZwW9RRD2ZQU5xIRnF10YvYtM8Dlj71Dr3od8VD5p";

  console.log('SimpleNotesPage: API Key =', apiKey);

  return (
    <LiveblocksProvider publicApiKey={apiKey}>
      <RoomProvider
        id="simple-notes-room"
        initialPresence={{ isTyping: false }}
        initialStorage={{
          notes: new LiveList([]),
          products: new LiveList([]),
          comments: new LiveList([]),
          highlights: new LiveList([]),
        }}
      >
        <div className="min-h-screen bg-gray-50">
          <NotesBoard />
        </div>
      </RoomProvider>
    </LiveblocksProvider>
  );
} 