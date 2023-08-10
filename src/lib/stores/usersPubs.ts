import { writable } from 'svelte/store';
import type { NDKUserProfile } from "@nostr-dev-kit/ndk";

// Define the user profile store
export const userProfileStore = writable<{ [key: string]: NDKUserProfile }>({});


// Function to update the user profile in the store
export function updateUserProfile(userPub: string, profile: NDKUserProfile) {
  userProfileStore.update((store) => {
    return {
      ...store,
      [userPub]: profile,
    };
  });
}
