import { writable } from 'svelte/store';
import type { NDKUser } from '@nostr-dev-kit/ndk';

export const ndkUser = writable<NDKUser | null>(null);
export const isNip05Valid = writable<{
    isNip05Valid: boolean | null;
    Nip05address: string | undefined;
    UserNpub: string | undefined;
  }>({
    isNip05Valid: false,
    Nip05address: undefined,
    UserNpub: undefined
  });
