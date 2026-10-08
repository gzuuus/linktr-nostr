import { browser } from "$app/environment";
import { writable, type Writable } from "svelte/store";

export function localStorageStore<T>(key: string, initialValue: T): Writable<T> {
  let stored: T = initialValue;
  if (browser) {
    try {
      const raw = localStorage.getItem(key);
      if (raw !== null) stored = JSON.parse(raw) as T;
    } catch {
      stored = initialValue;
    }
  }
  const store = writable<T>(stored);
  if (browser) {
    store.subscribe((value) => {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch {}
    });
  }
  return store;
}
