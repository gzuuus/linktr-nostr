import { writable } from 'svelte/store';
import NDK from '@nostr-dev-kit/ndk';

export const defaulRelaysUrls: string[] = [
    'wss://purplepag.es',
    'wss://relay.nostr.band',
    'wss://nos.lol',
    'wss://nostr.mom',
    'wss://offchain.pub/',
    'wss://nostr-pub.wellorder.net',
    'wss://nostr.wine',
]

const ndk = new NDK({
    explicitRelayUrls: defaulRelaysUrls
});

const ndkStore = writable(ndk);

export default ndkStore;