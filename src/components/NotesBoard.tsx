'use client';

import { useState, useEffect } from 'react';
import {
  useStorage,
  useMutation,
  useUpdateMyPresence,
} from '@liveblocks/react';
import { LiveList } from '@liveblocks/client';

export default function NotesBoard() {
  const notes = useStorage((root) => root.notes) as LiveList<string> | null;
  const addNote = useMutation(({ storage }, noteText: string) => {
    const notesList = storage.get('notes');
    if (notesList && notesList.push) {
      notesList.push(noteText);
    }
  }, []);
  const updateMyPresence = useUpdateMyPresence();
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    updateMyPresence({ isTyping: false });
  }, [updateMyPresence]);

  // Add sample notes if none exist
  useEffect(() => {
    if (notes && notes.length === 0) {
      const sampleNotes = [
        'Welcome to Collaboard! 🎉',
        'This is a collaborative notes board.',
        'Add your ideas and thoughts here.',
        'Everyone can see and edit in real-time!',
      ];
      sampleNotes.forEach(note => addNote(note));
    }
  }, [notes, addNote]);

  const handleAddNote = () => {
    const trimmed = newNote.trim();
    if (!trimmed || !notes) return;

    addNote(trimmed);
    setNewNote('');
  };

  if (!notes) {
    return <div>Loading notes...</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Notes Board 📝</h1>
        <div className="text-sm text-gray-500">
          {notes.length} note{notes.length !== 1 ? 's' : ''}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {notes.map((note, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-gray-700 whitespace-pre-wrap">{note}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <h3 className="text-lg font-semibold mb-3">Add New Note</h3>
        <div className="flex gap-2">
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleAddNote()}
            placeholder="Type your note here..."
            className="flex-1 p-2 border border-gray-300 rounded resize-none"
            rows={3}
          />
          <button
            onClick={handleAddNote}
            disabled={!newNote.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed self-end"
          >
            Add Note
          </button>
        </div>
      </div>
    </div>
  );
}

