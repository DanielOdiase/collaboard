'use client';

import { useState, useEffect } from 'react';
import { RoomProvider } from '../../liveblocks.config';
import { ClientSideSuspense } from '@liveblocks/react/suspense';
import { LiveList } from '@liveblocks/client';
import dynamic from 'next/dynamic';
import Navigation from '@/components/Navigation';
import RoomInfo from '@/components/RoomInfo';
import VeltClientProvider, { VeltCommentToolbar } from '@/components/VeltClientProvider';


// ✅ Lazy load components to avoid hydration issues
const NotesBoard = dynamic(() => import('@/components/NotesBoard'), {
  ssr: false,
});

const ProductBoard = dynamic(() => import('@/components/ProductBoard'), {
  ssr: false,
});

// Generate a new room ID on every refresh
function getRoomId(): string {
  // Always generate a new room ID with timestamp and random string
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substr(2, 9);
  return `room-${timestamp}-${randomString}`;
}

// Name Input Modal Component
function NameInputModal({ onSubmit, isSharedRoom = false }: { onSubmit: (name: string) => void; isSharedRoom?: boolean }) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('Please enter a name');
      return;
    }
    if (trimmedName.length > 20) {
      setError('Name must be 20 characters or less');
      return;
    }
    onSubmit(trimmedName);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-w-[90vw]">
        <h2 className="text-xl font-bold mb-4 text-gray-900">
          {isSharedRoom ? 'Join Collaboration Room' : 'Welcome to CollabBoard!'}
        </h2>
        <p className="text-gray-600 mb-4">
          {isSharedRoom 
            ? 'You\'re joining a shared collaboration room. Enter your name to start collaborating:'
            : 'Enter your name to start collaborating:'
          }
        </p>
        
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError('');
            }}
            placeholder="Your name"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            autoFocus
            maxLength={20}
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          
          <button
            type="submit"
            className="w-full mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {isSharedRoom ? 'Join Room' : 'Start Collaborating'}
          </button>
        </form>
      </div>
    </div>
  );
}

// Utility to get or prompt for user info
function getOrPromptUserInfo() {
  if (typeof window === 'undefined') {
    return {
      userId: 'unknown',
      name: 'Guest',
      color: '#3b82f6', // blue-500
    };
  }
  let userId = localStorage.getItem('collaboard_userId');
  const name = localStorage.getItem('collaboard_name');
  let color = localStorage.getItem('collaboard_color');
  if (!userId) {
    userId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('collaboard_userId', userId);
  }
  if (!name) {
    // Don't prompt here - we'll show UI instead
    return {
      userId,
      name: null, // Will trigger UI
      color: color || '#3b82f6',
    };
  }
  if (!color) {
    color = '#3b82f6';
    localStorage.setItem('collaboard_color', color);
  }
  return { userId, name, color };
}

export default function HomePage() {
  const [activeView, setActiveView] = useState<'notes' | 'products'>('notes');
  const [roomId, setRoomId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(() => getOrPromptUserInfo());
  const [showNameInput, setShowNameInput] = useState(!userInfo.name);
  const [isSharedRoom, setIsSharedRoom] = useState(false);

  useEffect(() => {
    let id = '';
    const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    if (searchParams && searchParams.has('room')) {
      id = searchParams.get('room') || '';
      setIsSharedRoom(true);
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

  const handleNameSubmit = (name: string) => {
    localStorage.setItem('collaboard_name', name);
    setUserInfo(prev => ({ ...prev, name }));
    setShowNameInput(false);
  };

  if (showNameInput) {
    return <NameInputModal onSubmit={handleNameSubmit} isSharedRoom={isSharedRoom} />;
  }

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

  // Debug: log userInfo and roomId before rendering VeltClientProvider
  console.log('VeltClientProvider userId:', userInfo.userId, 'name:', userInfo.name, 'documentId:', roomId);

  return (
    <VeltClientProvider
      userId={userInfo.userId || `user-${Date.now()}`}
      name={userInfo.name || 'Guest'}
      documentId={roomId}
    >
      <RoomProvider
        id={roomId}
        initialPresence={{
          userId: userInfo.userId || `user-${Date.now()}`,
          name: userInfo.name || 'Guest',
          color: userInfo.color,
          isTyping: false,
          previewHighlight: null,
          cursor: null,
        }}
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
              <div className="flex justify-center items-center mt-6 mb-8">
                {activeView === 'products' && <VeltCommentToolbar />}
              </div>
              {activeView === 'notes' ? <NotesBoard /> : <ProductBoard />}
              <RoomInfo roomId={roomId} />
            </div>
          )}
        </ClientSideSuspense>
      </RoomProvider>
    </VeltClientProvider>
  );
}
