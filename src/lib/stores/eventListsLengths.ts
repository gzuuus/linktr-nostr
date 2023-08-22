import { writable } from 'svelte/store';

interface Lengths {
  [key: number]: number;
}

export const lengthStore = writable<Lengths>({});

export function updateLength(eventKind: number, length: number) {
  lengthStore.update((lengths) => ({
    ...lengths,
    [eventKind]: length,
  }));
}