import { writable } from "svelte/store";
import type { NDKCacheAdapter } from "@nostr-dev-kit/ndk";
import NDKCacheAdapterDexie from "@nostr-dev-kit/ndk-cache-dexie";
import { browser } from "$app/environment";
import NDKSvelte from "@nostr-dev-kit/ndk-svelte";

let cacheAdapter: NDKCacheAdapter | undefined;

if (browser) {
  cacheAdapter = new NDKCacheAdapterDexie({
    dbName: "nostreeV02",
  });
}

export const defaulRelaysUrls: string[] = [
  "wss://purplepag.es",
  "wss://relay.nostr.band",
  "wss://nos.lol",
  "wss://bouncer.nostree.me",
];

const ndk = new NDKSvelte({
  explicitRelayUrls: defaulRelaysUrls,
  cacheAdapter,
  enableOutboxModel: false,
});

ndk.connect().then(() => console.log("ndk connected successfully"));

const ndkStore = writable(ndk);

export default ndkStore;
