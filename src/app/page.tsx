'use client';

import {
  RoomProvider,
  ClientSideSuspense,
} from '@liveblocks/react/suspense';
import { LiveList } from '@liveblocks/client';
import dynamic from 'next/dynamic';

// ✅ Lazy load NotesBoard to avoid hydration issues
const NotesBoard = dynamic(() => import('@/components/NotesBoard'), {
  ssr: false,
});

export default function HomePage() {
  return (
    <RoomProvider
      id="collabboard-room-final87"
      initialPresence={{ isTyping: false }}
      initialStorage={{
        notes: new LiveList([]), // ✅ This creates a LiveList properly
      }}
    >
      <ClientSideSuspense fallback={<div>Loading…</div>}>
        {() => <NotesBoard />}
      </ClientSideSuspense>
    </RoomProvider>
  );
}
