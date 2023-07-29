import type { PageLoad } from './$types';
import { get as getStore } from 'svelte/store';
import ndkStore from '$lib/stores/provider';
import { isNip05 } from '$lib/utils/helpers';
import { NDKUser } from '@nostr-dev-kit/ndk';

export const load = (async ({ params }) => {
    const paramsArg = params.userPub;
    const ndk = getStore(ndkStore);
    let npub: string;

    console.log('paramsArg:', paramsArg);

    if (isNip05(paramsArg)) {
        console.log('Is Nip05:', true);
        try {
            let npubPromise = await NDKUser.fromNip05(paramsArg);
            console.log('npubPromise:', npubPromise);
            npub = npubPromise?.npub;
        } catch (error) {
            console.error('Error fetching NDKUser:', error);
        }
    } else {
        console.log('Is Nip05:', false);
        npub = paramsArg;
    }

    console.log('Final npub:', npub);

    const ndkUser = ndk.getUser({ npub: npub });

    return {
        pubkey: npub
    };
}) satisfies PageLoad;
