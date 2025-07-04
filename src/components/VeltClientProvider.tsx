"use client"

import { VeltProvider, VeltComments, VeltCommentTool, useIdentify, useSetDocumentId } from '@veltdev/react';

function VeltAuth({ userId, name }: { userId: string; name: string }) {
  useIdentify({
    userId: String(userId),
    name: String(name),
    organizationId: 'default-org',
  });
  return null;
}

function VeltDoc({ documentId }: { documentId: string }) {
  useSetDocumentId(documentId);
  return null;
}

export function VeltCommentToolbar() {
  return (
    <div className="flex items-center ml-4">
      <VeltCommentTool />
    </div>
  );
}

export default function VeltClientProvider({ children, userId, name, documentId }: { children: React.ReactNode; userId: string; name: string; documentId: string; }) {
  return (
    <VeltProvider apiKey={process.env.NEXT_PUBLIC_VELT_API_KEY!}>
      <VeltAuth userId={userId} name={name} />
      <VeltDoc documentId={documentId || 'default-room'} />
      <VeltComments />
      {children}
    </VeltProvider>
  );
}