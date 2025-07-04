"use client";
import { VeltProvider, VeltComments, VeltPresence, VeltCursor } from '@veltdev/react';

export default function VeltDemo() {
  return (
    <VeltProvider apiKey={process.env.NEXT_PUBLIC_VELT_API_KEY!}>
      <div style={{ height: 400, border: '1px solid #ccc', margin: 20, position: 'relative' }}>
        <h1>Velt Minimal Demo</h1>
        <p>Open this page in two tabs to see presence and cursors. Try adding a comment!</p>
        <VeltPresence />
        <VeltCursor />
        <VeltComments />
      </div>
    </VeltProvider>
  );
} 