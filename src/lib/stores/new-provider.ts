// newProvider.ts
import { writable } from 'svelte/store';
import { getNewNDKInstance } from './provider';
import type NDK from '@nostr-dev-kit/ndk';

const newNDKStore = writable<NDK | null>(null);
const newNDKConfigured = writable(false);

export function setNewNDKInstance(relayUrls?: string[]): void {
  const newNDK = getNewNDKInstance(relayUrls);
  newNDKStore.set(newNDK);
  newNDKConfigured.set(true);
}

export function resetNewNDKConfigured(): void {
  newNDKConfigured.set(false);
}

export default newNDKStore;
export { newNDKConfigured };
