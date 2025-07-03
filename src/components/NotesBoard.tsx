
'use client';

import { useEffect, useState } from 'react';
import {
  useOthers,
  useUpdateMyPresence,
  useStorage,
  useMutation,
} from '@liveblocks/react';
import { LiveList } from '@liveblocks/client';

export default function NotesBoard() {
  const notes = useStorage((root) => root.notes) as LiveList<string> | null;
  const others = useOthers();
  const updateMyPresence = useUpdateMyPresence();
  const [input, setInput] = useState('');

  useEffect(() => {
    updateMyPresence({ isTyping: false });
    console.log('📦 notes type:', notes?.constructor?.name);
  }, [notes]);
  // 🟢 Track mouse position for cursor presence
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      updateMyPresence({
        cursor: { x: e.clientX, y: e.clientY },
      });
    };
    window.addEventListener('pointermove', handleMouseMove);
    return () => window.removeEventListener('pointermove', handleMouseMove);
  }, []);

  const addNote = useMutation(({ storage }, noteText: string) => {
    const notesList = storage.get('notes');
    if (notesList && notesList.push) {
      notesList.push(noteText);
    } else {
      console.warn('❌ Could not push note. notesList:', notesList);
    }
  }, []);

  const handleAddNote = () => {
    const trimmed = input.trim();
    if (!trimmed || !notes) return;

    addNote(trimmed);
    setInput('');
  };

  if (!notes) {
    return <div>Loading notes...</div>;
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">CollabBoard 📝</h1>

      <div className="mb-4">
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Write a note..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          onClick={handleAddNote}
          disabled={!notes}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          Add Note
        </button>
      </div>

      <ul className="space-y-2">
        {notes.map((note, index) => (
          <li
            key={index}
            className="p-2 border border-gray-200 rounded shadow-sm"
          >
            {note}
          </li>
        ))}
      </ul>

      <p className="mt-6 text-sm text-gray-500">
        {others.length} collaborator{others.length !== 1 ? 's' : ''} online
      </p>
    </div>
  );
}

