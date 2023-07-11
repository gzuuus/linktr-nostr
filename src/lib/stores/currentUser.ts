import { writable } from 'svelte/store';
import type NDKUser from '@nostr-dev-kit/ndk';


export const currentUser = writable<NDKUser | undefined>(undefined);
