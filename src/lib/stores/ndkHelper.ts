import NDK from '@nostr-dev-kit/ndk';

export function createNewNDK(relayUrls: string[]): NDK {
    return new NDK({
        explicitRelayUrls: relayUrls,
    });
}
