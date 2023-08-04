// provider.ts
import { writable } from 'svelte/store';
import NDK from '@nostr-dev-kit/ndk';
import { createNewNDK } from '$lib/stores/ndkHelper';

let relaySet: string[] = [
    'wss://purplepag.es',
    'wss://relay.nostr.band',
    'wss://nos.lol',
    'wss://relayable.org',
    'wss://free.nostr.lc',
    'wss://nostr.wine',
];

function getNewNDKInstance(relayUrls?: string[]): NDK {
    if (relayUrls && relayUrls.length > 0) {
        return createNewNDK(relayUrls);
    } else {
        return new NDK({
            explicitRelayUrls: relaySet,
        });
    }
}

const ndk = getNewNDKInstance();

const ndkStore = writable(ndk);

export default ndkStore;

export { getNewNDKInstance };
