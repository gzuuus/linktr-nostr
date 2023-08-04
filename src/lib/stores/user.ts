import { writable } from 'svelte/store';
import type { NDKUser } from '@nostr-dev-kit/ndk';

export const ndkUser = writable<NDKUser | null>(null);
