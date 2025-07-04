import { createClient } from '@liveblocks/client';
import { createRoomContext } from '@liveblocks/react';

const client = createClient({
    publicApiKey: 'pk_dev_ikGtDSHCJmrLlmPXItAmdykDZwW9RRD2ZQU5xIRnF10YvYtM8Dlj71Dr3od8VD5p',
});

export type Presence = {
    userId?: string;
    name?: string;
    color?: string;
    isTyping?: boolean;
    previewHighlight?: any;
    cursor?: any;
};

export type Storage = {
    products: any;
    notes?: any;
    comments?: any;
    highlights?: any;
};

const {
    RoomProvider,
    useMutation,
    useStorage,
    useUpdateMyPresence,
    useOthers,
    useSelf,
    useRoom,
} = createRoomContext<Presence, Storage>(client);

export {
    RoomProvider,
    useMutation,
    useStorage,
    useUpdateMyPresence,
    useOthers,
    useSelf,
    useRoom,
}; 