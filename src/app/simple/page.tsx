'use client';

import { useState } from 'react';

export default function SimplePage() {
  const [notes, setNotes] = useState<string[]>([]);
  const [newNote, setNewNote] = useState('');

  const addNote = () => {
    if (newNote.trim()) {
      setNotes([...notes, newNote.trim()]);
      setNewNote('');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Simple Notes (No Liveblocks)</h1>
      
      <div className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Add a note..."
            className="flex-1 p-2 border border-gray-300 rounded"
          />
          <button
            onClick={addNote}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add Note
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {notes.map((note, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <p>{note}</p>
          </div>
        ))}
      </div>

      {notes.length === 0 && (
        <p className="text-blue-600 text-center mt-8">No notes yet. Add one above!</p>
      )}
    </div>
  );
} 