import { LiveList } from '@liveblocks/client';

declare global {
  interface Liveblocks {
    Storage: {
      notes: LiveList<string>;
      products: LiveList<{
        id: string;
        name: string;
        description: string;
        status: 'idea' | 'in-progress' | 'completed';
        priority: 'low' | 'medium' | 'high';
        createdAt: number;
      }>;
      comments: LiveList<{
        id: string;
        productId: string;
        text: string;
        author: string;
        createdAt: number;
      }>;
      highlights: LiveList<{
        id: string;
        productId: string;
        start: number;
        end: number;
        text: string;
        comments: Array<{
          id: string;
          author: string;
          text: string;
          createdAt: number;
        }>;
      }>;
    };
    Presence: {
      isTyping: boolean;
    };
  }
}

export { };
