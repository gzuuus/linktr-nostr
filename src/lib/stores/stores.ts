import { writable, type Writable } from "svelte/store";
import { browser } from "$app/environment";
import { localStorageStore } from "@skeletonlabs/skeleton";

export const storeTheme = writable(browser ? document.body.getAttribute("data-theme") ?? "" : "nostree-theme");
export const storePreview = writable(false);
export const storeLivePreview = writable("");

interface UserLocalStore {
  lastUserLogged: string | undefined;
  lastUserTheme: string | undefined;
  currentUserFollows: string[] | undefined;
}
export const localStore: Writable<UserLocalStore> = localStorageStore("nostree-localStore", {
  lastUserLogged: undefined,
  lastUserTheme: undefined,
  currentUserFollows: undefined,
});
