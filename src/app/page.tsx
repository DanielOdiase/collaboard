'use client';

import { useState, useEffect } from 'react';
import {
  RoomProvider,
  ClientSideSuspense,
} from '@liveblocks/react/suspense';
import { LiveList } from '@liveblocks/client';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';

// ✅ Lazy load components to avoid hydration issues
const NotesBoard = dynamic(() => import('@/components/NotesBoard'), {
  ssr: false,
});

const ProductBoard = dynamic(() => import('@/components/ProductBoard'), {
  ssr: false,
});

const Navigation = dynamic(() => import('@/components/Navigation'), {
  ssr: false,
});

const RoomInfo = dynamic(() => import('@/components/RoomInfo'), {
  ssr: false,
});

// Generate a new room ID on every refresh
function getRoomId(): string {
  // Always generate a new room ID with timestamp and random string
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substr(2, 9);
  return `room-${timestamp}-${randomString}`;
}

export default function HomePage() {
  const [activeView, setActiveView] = useState<'notes' | 'products'>('notes');
  const [roomId, setRoomId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;

  useEffect(() => {
    let id = '';
    if (searchParams && searchParams.has('room')) {
      id = searchParams.get('room') || '';
    } else {
      id = getRoomId();
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        url.searchParams.set('room', id);
        window.history.replaceState({}, '', url.toString());
      }
    }
    setRoomId(id);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-blue-700">Initializing collaboration room...</p>
        </div>
      </div>
    );
  }

  return (
    <RoomProvider
      id={roomId}
      initialPresence={{ isTyping: false }}
      initialStorage={{
        notes: new LiveList([]),
        products: new LiveList([]),
        comments: new LiveList([]),
        highlights: new LiveList([]),
      }}
    >
      <ClientSideSuspense 
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                        <p className="text-blue-700">Connecting to collaboration room...</p>
          <p className="text-sm text-blue-600 mt-2">Room ID: {roomId}</p>
            </div>
          </div>
        }
      >
        {() => (
          <div>
            <Navigation activeView={activeView} onViewChange={setActiveView} />
            {activeView === 'notes' ? <NotesBoard /> : <ProductBoard />}
            <RoomInfo roomId={roomId} />
          </div>
        )}
      </ClientSideSuspense>
    </RoomProvider>
  );
}
