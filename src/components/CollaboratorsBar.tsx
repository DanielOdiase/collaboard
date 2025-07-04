'use client';

import { useOthers, useSelf } from '@liveblocks/react';

const COLORS = [
  'bg-blue-500',
  'bg-green-500',
  'bg-pink-500',
  'bg-yellow-500',
  'bg-purple-500',
  'bg-red-500',
  'bg-indigo-500',
  'bg-teal-500',
];

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

export default function CollaboratorsBar() {
  const others = useOthers();
  const self = useSelf();
  const everyone = [
    ...(self ? [{ ...self, isSelf: true }] : []),
    ...others.map((o) => ({ ...o, isSelf: false })),
  ];

  return (
    <div className="flex items-center space-x-2">
      {everyone.map((user, i) => {
        const info = user.info || {};
        const name = info.name || `Anon${user.connectionId || i + 1}`;
        const color = info.color || COLORS[(user.connectionId || i) % COLORS.length];
        const initials = getInitials(name) || 'A';
        const isTyping = user.presence?.isTyping;
        return (
          <div
            key={user.connectionId || i}
            className={`relative group flex items-center`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold shadow border-2 ${color} ${user.isSelf ? 'ring-2 ring-black' : 'opacity-80'}`}
              title={name}
            >
              {initials}
            </div>
            <span className="absolute left-1/2 -translate-x-1/2 mt-10 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-20">
              {user.isSelf ? name + ' (You)' : name}
            </span>
            {isTyping && (
              <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full border border-blue-300 animate-pulse">typing…</span>
            )}
          </div>
        );
      })}
    </div>
  );
} 