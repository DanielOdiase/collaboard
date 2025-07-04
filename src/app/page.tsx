'use client';

import { useState, useEffect } from 'react';
import {
  RoomProvider,
  ClientSideSuspense,
} from '@liveblocks/react/suspense';
import { LiveList } from '@liveblocks/client';
import dynamic from 'next/dynamic';

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

// Generate a stable room ID based on URL or create a new one
function getRoomId(): string {
  // In development, use a consistent room ID
  if (process.env.NODE_ENV === 'development') {
    return 'collaboard-dev-room';
  }
  
  // In production, try to get room ID from URL or localStorage
  if (typeof window !== 'undefined') {
    // Check URL params first
    const urlParams = new URLSearchParams(window.location.search);
    const roomIdFromUrl = urlParams.get('room');
    if (roomIdFromUrl) {
      return roomIdFromUrl;
    }
    
    // Check localStorage for existing room
    const savedRoomId = localStorage.getItem('collaboard-room-id');
    if (savedRoomId) {
      return savedRoomId;
    }
    
    // Generate new room ID
    const newRoomId = `room-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('collaboard-room-id', newRoomId);
    return newRoomId;
  }
  
  // Fallback for SSR
  return 'default-room';
}

export default function HomePage() {
  const [activeView, setActiveView] = useState<'notes' | 'products'>('notes');
  const [roomId, setRoomId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const id = getRoomId();
    setRoomId(id);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing collaboration room...</p>
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
              <p className="text-gray-600">Connecting to collaboration room...</p>
              <p className="text-sm text-gray-500 mt-2">Room ID: {roomId}</p>
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
