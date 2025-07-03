import { LiveList } from '@liveblocks/client';

declare global {
  interface Liveblocks {
    Storage: {
      notes: LiveList<string>;
    };
  }
}
