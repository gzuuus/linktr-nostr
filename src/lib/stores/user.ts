import { writable } from "svelte/store";
import type { NDKUser } from "@nostr-dev-kit/ndk";

export interface UserProfileIdentifiers {
  isNip05Valid: boolean | null;
  Nip05address: string | undefined;
  UserNpub: string | undefined;
  Vanity: string | undefined;
  UserIdentifier: string | undefined;
}
export interface UserCustomTheme {
  UserTheme: string | undefined;
  themeIdentifier: string | undefined;
  themeCustomCss: string | undefined;
}
export const ndkUser = writable<NDKUser | null>(null);
export const currentUserFollows = writable<string[]>([]);
export const isNip05Valid = writable<UserProfileIdentifiers>({
  isNip05Valid: null,
  Nip05address: undefined,
  UserNpub: undefined,
  Vanity: undefined,
  UserIdentifier: undefined,
});
export const userCustomTheme = writable<UserCustomTheme>({
  UserTheme: undefined,
  themeIdentifier: undefined,
  themeCustomCss: undefined,
});
