import { writable } from "svelte/store";
import type { NDKUser } from "@nostr-dev-kit/ndk";

export const ndkUser = writable<NDKUser | null>(null);
export const currentUserFollows = writable<string[]>([]);
export const isNip05Valid = writable<{
  isNip05Valid: boolean | null;
  Nip05address: string | undefined;
  UserNpub: string | undefined;
  Vanity: string | undefined;
  UserIdentifier: string | undefined;
}>({
  isNip05Valid: null,
  Nip05address: undefined,
  UserNpub: undefined,
  Vanity: undefined,
  UserIdentifier: undefined,
});
export const userCustomTheme = writable<{
  UserTheme: string | undefined;
  themeIdentifier: string | undefined;
  themeCustomCss: string | undefined;
}>({
  UserTheme: undefined,
  themeIdentifier: undefined,
  themeCustomCss: undefined,
});
