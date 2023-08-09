
  import { writable } from 'svelte/store';
  import type { NDKUserProfile } from "@nostr-dev-kit/ndk";

  export const userProfileStore = writable<{ [key: string]: NDKUserProfile }>({});

