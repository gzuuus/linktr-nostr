import { writable } from 'svelte/store';
import NDK from '@nostr-dev-kit/ndk';

const ndk = new NDK({
    explicitRelayUrls: [
        'wss://purplepag.es',
        'wss://relay.nostr.band',
        'wss://nos.lol',
        'wss://relayable.org',
        'wss://free.nostr.lc',
        'wss://nostr.wine',
    ]
});

const ndkStore = writable(ndk);

export default ndkStore;