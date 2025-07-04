'use client';

import { useStorage, useMutation } from '@liveblocks/react';
import { LiveList } from '@liveblocks/client';

export default function TestLiveblocks() {
  const notes = useStorage((root) => root.notes) as LiveList<string> | null;
  const addNote = useMutation(({ storage }, noteText: string) => {
    const notesList = storage.get('notes');
    if (notesList && notesList.push) {
      notesList.push(noteText);
    }
  }, []);

  console.log('TestLiveblocks: notes value:', notes);
  console.log('TestLiveblocks: notes type:', typeof notes);

  const handleTest = () => {
    console.log('TestLiveblocks: Adding test note');
    addNote('Test note from TestLiveblocks component');
  };

  return (
    <div className="p-4 bg-yellow-100 border border-yellow-300 rounded-lg mb-4">
      <h3 className="text-lg font-semibold mb-2">Liveblocks Test Component</h3>
      <p className="text-sm mb-2">Notes value: {String(notes)}</p>
      <p className="text-sm mb-2">Notes type: {typeof notes}</p>
      <p className="text-sm mb-2">Notes length: {notes?.length || 'N/A'}</p>
      <button
        onClick={handleTest}
        className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
      >
        Add Test Note
      </button>
    </div>
  );
} 