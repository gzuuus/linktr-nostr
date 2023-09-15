import { writable } from 'svelte/store';
import NDK from '@nostr-dev-kit/ndk';
import type { NDKCacheAdapter } from '@nostr-dev-kit/ndk';
import NDKCacheAdapterDexie from '@nostr-dev-kit/ndk-cache-dexie';
import { browser } from '$app/environment';

let cacheAdapter: NDKCacheAdapter | undefined;

if (browser) {
    cacheAdapter = new NDKCacheAdapterDexie({
        dbName: 'nostreeV01'
    });
}

export const defaulRelaysUrls: string[] = [
    'wss://purplepag.es',
    'wss://relay.nostr.band',
    'wss://nos.lol',
    'wss://nostr.mom',
    'wss://offchain.pub/',
    'wss://nostr-pub.wellorder.net',
    'wss://nostr.wine',
];

const ndk = new NDK({
    explicitRelayUrls: defaulRelaysUrls,
    cacheAdapter
});

const ndkStore = writable(ndk);

export default ndkStore;
