'use client';

import { useEffect } from 'react';
import {
  LiveblocksProvider,
  RoomProvider,
  useStorage,
  useMutation,
} from '@liveblocks/react';
import { LiveList } from '@liveblocks/client';

function TestComponent() {
  const notes = useStorage((root) => root.notes);
  const addNote = useMutation(({ storage }) => {
    storage.get('notes').push('Test note ' + Date.now());
  }, []);

  useEffect(() => {
    console.log('TestComponent: notes =', notes);
  }, [notes]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Liveblocks Test</h1>
      <div className="mb-4">
        <p>Notes: {notes ? notes.length : 'Loading...'}</p>
        <button 
          onClick={addNote}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Add Test Note
        </button>
      </div>
      {notes && (
        <div>
          <h2 className="text-lg font-semibold mb-2">Current Notes:</h2>
          <ul>
            {notes.map((note, index) => (
              <li key={index} className="mb-1">{note}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function TestPage() {
  const apiKey = process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY || 
                 "pk_dev_ikGtDSHCJmrLlmPXItAmdykDZwW9RRD2ZQU5xIRnF10YvYtM8Dlj71Dr3od8VD5p";

  console.log('TestPage: API Key =', apiKey);

  return (
    <LiveblocksProvider publicApiKey={apiKey}>
      <RoomProvider
        id="test-room"
        initialStorage={{
          notes: new LiveList<string>(),
          products: new LiveList<{ id: string; name: string; description: string; status: 'idea' | 'in-progress' | 'completed'; priority: 'low' | 'medium' | 'high'; createdAt: number }>(),
          comments: new LiveList<{ id: string; cardId: string; text: string; author: string; createdAt: number }>(),
          highlights: new LiveList<{ id: string; cardId: string; text: string; comment: string; author: string; createdAt: number }>(),
        }}
      >
        <TestComponent />
      </RoomProvider>
    </LiveblocksProvider>
  );
} 